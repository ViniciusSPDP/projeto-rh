// src/lib/minio.ts
import { S3Client, CreateBucketCommand, HeadBucketCommand, PutBucketPolicyCommand } from "@aws-sdk/client-s3";

const endpointRaw = process.env.MINIO_ENDPOINT || 'localhost';
const hostClean = endpointRaw.replace(/^https?:\/\//, '').replace(/\/$/, '');

const useSSL = process.env.MINIO_USE_SSL === 'true';
const protocol = useSSL ? 'https' : 'http';

const port = process.env.MINIO_PORT 
  ? `:${process.env.MINIO_PORT}` 
  : (useSSL ? '' : ':9000'); 

const endpointUrl = `${protocol}://${hostClean}${port}`;

// --- NOVA EXPORTAÇÃO AQUI ---
// Exportamos a URL base para usar na construção dos links públicos
export const minioBaseUrl = endpointUrl; 
// ----------------------------

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
      await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
      
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${bucketName}/*`],
          },
        ],
      };
      
      await s3Client.send(new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(policy)
      }));
    } else {
      throw error;
    }
  }
}