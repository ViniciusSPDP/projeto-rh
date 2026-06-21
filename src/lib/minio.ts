// src/lib/minio.ts
import { S3Client, CreateBucketCommand, HeadBucketCommand, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const endpointRaw = process.env.MINIO_ENDPOINT || 'localhost';
const hostClean = endpointRaw.replace(/^https?:\/\//, '').replace(/\/$/, '');

const useSSL = process.env.MINIO_USE_SSL === 'true';
const protocol = useSSL ? 'https' : 'http';

const port = process.env.MINIO_PORT 
  ? `:${process.env.MINIO_PORT}` 
  : (useSSL ? '' : ':9000'); 

const endpointUrl = `${protocol}://${hostClean}${port}`;

export const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: endpointUrl,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || '',
    secretAccessKey: process.env.MINIO_SECRET_KEY || '',
  },
});

export const bucketName = process.env.MINIO_BUCKET_NAME || 'projeto-rh-files';

export async function ensureBucketExists() {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
  } catch (error: unknown) { // Use unknown aqui também ao invés de any
    const err = error as { name?: string; $metadata?: { httpStatusCode?: number } };
    
    if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
      console.log(`[MINIO] Criando bucket ${bucketName}...`);
      // Bucket PRIVADO: não aplicamos nenhuma policy pública (s3:GetObject para *).
      // O acesso aos objetos é feito server-side via credenciais (proxy autenticado).
      await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
    } else {
      throw error;
    }
  }
}

/**
 * Extrai a KEY do objeto no bucket a partir do valor salvo em `curriculoUrl`.
 *
 * Aceita: KEY crua ("curriculos/x.pdf"), URL pública completa do MinIO
 * (`https://host/projeto-rh/curriculos/x.pdf`), URLs com porta (:443/:9000) ou
 * malformadas ("https:/host..."). Retorna `null` para valores que NÃO são objetos
 * deste bucket (URLs externas, ou currículos legados servidos do disco local em
 * `/uploads/...` / `/api/curriculos/...`), para que o proxy responda 404 limpo.
 */
export function extractObjectKey(stored: string | null | undefined): string | null {
  if (!stored) return null;
  let s = stored.trim();
  if (!s) return null;

  // Conserta URL malformada "https:/host" -> "https://host"
  s = s.replace(/^(https?):\/(?!\/)/i, '$1://');
  // Normaliza removendo portas explícitas conhecidas
  s = s.replace(/:443(?=\/|$)/, '').replace(/:9000(?=\/|$)/, '');

  // URL pública do MinIO: pega tudo após "/<bucket>/"
  const marker = `/${bucketName}/`;
  const idx = s.indexOf(marker);
  if (idx !== -1) {
    return decodeURIComponent(s.slice(idx + marker.length).split('?')[0]) || null;
  }

  // URL http(s) que não contém o bucket -> não é objeto nosso
  if (/^https?:\/\//i.test(s)) return null;

  // Currículo legado em disco local -> não é objeto do MinIO
  if (s.startsWith('/uploads/') || s.startsWith('/api/') || s.includes('uploads/curriculos')) {
    return null;
  }

  // KEY crua ("curriculos/x.pdf", com ou sem barra inicial)
  return s.replace(/^\/+/, '') || null;
}

// --- IMAGENS (fotos de candidato / avatar de usuário) no MinIO privado ---

function mimeToExt(mime: string): string {
  switch (mime) {
    case 'image/png': return 'png';
    case 'image/webp': return 'webp';
    case 'image/gif': return 'gif';
    case 'image/jpeg':
    case 'image/jpg':
    default: return 'jpg';
  }
}

/** Content-Type a partir da extensão da KEY (para servir o objeto). */
export function contentTypeFromKey(key: string): string {
  const ext = key.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'png': return 'image/png';
    case 'webp': return 'image/webp';
    case 'gif': return 'image/gif';
    case 'pdf': return 'application/pdf';
    case 'jpg':
    case 'jpeg':
    default: return 'image/jpeg';
  }
}

/**
 * Faz upload de uma imagem em base64 para o MinIO e retorna a KEY gerada.
 *
 * Aceita data URL (`data:image/jpeg;base64,...`) ou base64 cru. Se o valor já for uma
 * KEY (`fotos/...`) ou uma URL externa (`http...`), retorna inalterado — assim a função
 * é idempotente em edições onde a foto não mudou. Retorna `null` para valor vazio.
 */
export async function uploadBase64Image(
  input: string | null | undefined,
  keyPrefix: string,
): Promise<string | null> {
  if (input === null || input === undefined) return null;
  const s = String(input).trim();
  if (!s) return null;
  if (s.startsWith('fotos/')) return s;        // já é uma KEY do MinIO
  if (/^https?:\/\//i.test(s)) return s;       // URL externa (campo legado "Foto (URL)") -> mantém

  let mime = 'image/jpeg';
  let b64 = s;
  const m = s.match(/^data:([\w/+.-]+);base64,(.*)$/s);
  if (m) { mime = m[1]; b64 = m[2]; }
  else if (s.startsWith('iVBOR')) mime = 'image/png'; // assinatura base64 de PNG (JPEG '/9j/' já é o default)

  const buffer = Buffer.from(b64, 'base64');
  if (buffer.length === 0) return null;

  await ensureBucketExists();
  const key = `${keyPrefix}/${crypto.randomBytes(12).toString('hex')}.${mimeToExt(mime)}`;
  await s3Client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: mime,
  }));
  return key;
}

/** Baixa um objeto do MinIO como bytes. Retorna `null` se não houver corpo. */
export async function getObjectBytes(key: string): Promise<Uint8Array | null> {
  const obj = await s3Client.send(new GetObjectCommand({ Bucket: bucketName, Key: key }));
  if (!obj.Body) return null;
  return obj.Body.transformToByteArray();
}