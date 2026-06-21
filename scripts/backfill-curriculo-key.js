// scripts/backfill-curriculo-key.js
//
// Backfill idempotente: normaliza Candidatos.curriculoUrl de URL pública do MinIO
// para apenas a KEY do objeto (ex.: "https://host/projeto-rh/curriculos/x.pdf"
// -> "curriculos/x.pdf"). Necessário apenas para LIMPAR o banco — a exibição já
// funciona em runtime via extractObjectKey() no proxy /api/candidatos/[id]/curriculo.
//
// Uso:
//   node scripts/backfill-curriculo-key.js --dry-run   (mostra o que mudaria)
//   node scripts/backfill-curriculo-key.js             (aplica)
//
// Valores que NÃO são objetos deste bucket (currículos legados em disco /uploads/...,
// URLs externas) são deixados intactos e listados como [REVISAR].

const fs = require('fs');
const path = require('path');

// --- Carrega o .env manualmente (script Node puro, sem Next) ---
(function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim().replace(/^["']|["']$/g, '');
    if (process.env[key] === undefined) process.env[key] = val;
  }
})();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bucketName = process.env.MINIO_BUCKET_NAME || 'projeto-rh-files';

// Espelha src/lib/minio.ts -> extractObjectKey (mantenha em sincronia)
function extractObjectKey(stored) {
  if (!stored) return null;
  let s = stored.trim();
  if (!s) return null;
  s = s.replace(/^(https?):\/(?!\/)/i, '$1://');
  s = s.replace(/:443(?=\/|$)/, '').replace(/:9000(?=\/|$)/, '');
  const marker = `/${bucketName}/`;
  const idx = s.indexOf(marker);
  if (idx !== -1) return decodeURIComponent(s.slice(idx + marker.length).split('?')[0]) || null;
  if (/^https?:\/\//i.test(s)) return null;
  if (s.startsWith('/uploads/') || s.startsWith('/api/') || s.includes('uploads/curriculos')) return null;
  return s.replace(/^\/+/, '') || null;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  console.log(`[BACKFILL] bucket=${bucketName} dryRun=${dryRun}\n`);

  const candidatos = await prisma.candidatos.findMany({
    where: { curriculoUrl: { not: null } },
    select: { idCandidato: true, curriculoUrl: true },
  });

  let updated = 0, skipped = 0, revisar = 0;

  for (const c of candidatos) {
    const original = c.curriculoUrl;
    const key = extractObjectKey(original);

    if (key === null) {
      revisar++;
      console.warn(`[REVISAR] id=${c.idCandidato} valor não-MinIO: ${original}`);
      continue;
    }
    if (key === original) { skipped++; continue; } // já normalizado

    console.log(`id=${c.idCandidato}: "${original}" -> "${key}"`);
    if (!dryRun) {
      await prisma.candidatos.update({
        where: { idCandidato: c.idCandidato },
        data: { curriculoUrl: key },
      });
    }
    updated++;
  }

  console.log(`\n[BACKFILL] total=${candidatos.length} updated=${updated} skipped=${skipped} revisar=${revisar} dryRun=${dryRun}`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
