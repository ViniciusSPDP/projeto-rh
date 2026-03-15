// src/lib/minio.ts
import * as Minio from 'minio';

// Função auxiliar para limpar o endpoint (remove http:// ou https://)
const getCleanEndpoint = (url: string) => {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
};

const endpointRaw = process.env.MINIO_ENDPOINT || 'localhost';
const endPoint = getCleanEndpoint(endpointRaw);

// Se a porta não estiver definida e estiver usando SSL, usa 443. Senão usa 9000.
const port = process.env.MINIO_PORT 
  ? parseInt(process.env.MINIO_PORT) 
  : (process.env.MINIO_USE_SSL === 'true' ? 443 : 9000);

const useSSL = process.env.MINIO_USE_SSL === 'true';

export const minioClient = new Minio.Client({
  endPoint: endPoint,
  port: port,
  useSSL: useSSL,
  accessKey: process.env.MINIO_ACCESS_KEY || '',
  secretKey: process.env.MINIO_SECRET_KEY || '',
  region: process.env.MINIO_REGION || 'us-east-1',
});

export const bucketName = process.env.MINIO_BUCKET_NAME || 'projeto-rh-files';