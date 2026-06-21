// scripts/backfill-fotos-minio.js
//
// Backfill idempotente: sobe as fotos hoje em base64 no banco para o MinIO e troca
// o valor pela KEY do objeto.
//   - Candidatos.fotoCandidato (data URL) -> fotos/candidatos/<hash>.<ext>
//   - usuario.fotourl        (base64 cru) -> fotos/usuarios/<hash>.<ext>
//
// Necessário para tirar o base64 do banco. A exibição já funciona em runtime com
// fallback (resolveFotoSrc / /api/user/avatar), então pode rodar a qualquer momento.
//
// Uso:
//   node scripts/backfill-fotos-minio.js --dry-run   (mostra o que mudaria)
//   node scripts/backfill-fotos-minio.js             (aplica)

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// --- Carrega .env ---
(function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2].trim().replace(/^["']|["']$/g, '');
    if (process.env[m[1]] === undefined) process.env[m[1]] = val;
  }
})();

const { PrismaClient } = require('@prisma/client');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const prisma = new PrismaClient();

// --- Cliente MinIO (mesma config de src/lib/minio.ts) ---
const hostClean = (process.env.MINIO_ENDPOINT || 'localhost').replace(/^https?:\/\//, '').replace(/\/$/, '');
const useSSL = process.env.MINIO_USE_SSL === 'true';
const protocol = useSSL ? 'https' : 'http';
const port = process.env.MINIO_PORT ? `:${process.env.MINIO_PORT}` : (useSSL ? '' : ':9000');
const endpointUrl = `${protocol}://${hostClean}${port}`;
const bucketName = process.env.MINIO_BUCKET_NAME || 'projeto-rh-files';

const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: endpointUrl,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || '',
    secretAccessKey: process.env.MINIO_SECRET_KEY || '',
  },
});

const dryRun = process.argv.includes('--dry-run');

function mimeToExt(mime) {
  switch (mime) {
    case 'image/png': return 'png';
    case 'image/webp': return 'webp';
    case 'image/gif': return 'gif';
    default: return 'jpg';
  }
}

// Espelha src/lib/minio.ts -> uploadBase64Image
async function uploadBase64Image(input, keyPrefix) {
  if (input === null || input === undefined) return null;
  const s = String(input).trim();
  if (!s) return null;
  if (s.startsWith('fotos/')) return s;        // já migrado
  if (/^https?:\/\//i.test(s)) return s;       // URL externa -> mantém

  let mime = 'image/jpeg';
  let b64 = s;
  const m = s.match(/^data:([\w/+.-]+);base64,(.*)$/s);
  if (m) { mime = m[1]; b64 = m[2]; }
  else if (s.startsWith('iVBOR')) mime = 'image/png';

  const buffer = Buffer.from(b64, 'base64');
  if (buffer.length === 0) return null;

  const key = `${keyPrefix}/${crypto.randomBytes(12).toString('hex')}.${mimeToExt(mime)}`;
  if (!dryRun) {
    await s3.send(new PutObjectCommand({ Bucket: bucketName, Key: key, Body: buffer, ContentType: mime }));
  }
  return key;
}

async function migrar(label, registros, getId, getFoto, prefix, update) {
  let updated = 0, skipped = 0;
  for (const r of registros) {
    const original = getFoto(r);
    const key = await uploadBase64Image(original, prefix);
    if (key === original) { skipped++; continue; }   // já era key/URL/null
    console.log(`[${label}] id=${getId(r)} -> ${key} (${Math.round((original || '').length / 1024)}KB base64)`);
    if (!dryRun) await update(r, key);
    updated++;
  }
  console.log(`[${label}] updated=${updated} skipped=${skipped} total=${registros.length}`);
}

async function main() {
  console.log(`[BACKFILL FOTOS] bucket=${bucketName} endpoint=${endpointUrl} dryRun=${dryRun}\n`);

  const candidatos = await prisma.candidatos.findMany({
    where: { fotoCandidato: { not: null } },
    select: { idCandidato: true, fotoCandidato: true },
  });
  await migrar(
    'CANDIDATO', candidatos,
    (c) => c.idCandidato, (c) => c.fotoCandidato, 'fotos/candidatos',
    (c, key) => prisma.candidatos.update({ where: { idCandidato: c.idCandidato }, data: { fotoCandidato: key } }),
  );

  const usuarios = await prisma.usuario.findMany({
    where: { fotourl: { not: null } },
    select: { id: true, fotourl: true },
  });
  await migrar(
    'USUARIO', usuarios,
    (u) => u.id, (u) => u.fotourl, 'fotos/usuarios',
    (u, key) => prisma.usuario.update({ where: { id: u.id }, data: { fotourl: key } }),
  );
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
