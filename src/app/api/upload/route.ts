// Arquivo: src/app/api/upload/route.ts (ou substitua o image/route.ts)
import { NextResponse } from 'next/server';
import { minioClient, bucketName } from '@/lib/minio';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado.' },
        { status: 400 }
      );
    }

    // 1. Converter File para Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Gerar nome único para o arquivo
    const fileExtension = file.name.split('.').pop();
    const randomName = crypto.randomBytes(16).toString('hex');
    const fileName = `${randomName}.${fileExtension}`;

    // 3. Verificar se bucket existe (segurança)
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
      // Define política como pública para leitura (opcional, depende da sua segurança)
      // Se for privado, você precisará gerar Presigned URLs para visualização
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
      await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
    }

    // 4. Enviar para o MinIO
    // O metaData é opcional, mas útil
    const metaData = {
      'Content-Type': file.type,
    };

    await minioClient.putObject(
      bucketName,
      fileName,
      buffer,
      buffer.length,
      metaData
    );

    // 5. Construir a URL Pública
    const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
    const port = process.env.MINIO_PORT ? `:${process.env.MINIO_PORT}` : '';
    const host = process.env.MINIO_ENDPOINT;
    
    // URL Final que será salva no Banco de Dados
    const publicUrl = `${protocol}://${host}${port}/${bucketName}/${fileName}`;

    console.log('Arquivo salvo no MinIO:', publicUrl);

    return NextResponse.json({ url: publicUrl }, { status: 201 });

  } catch (error) {
    console.error('Erro no upload MinIO:', error);
    return NextResponse.json(
      { error: 'Falha ao fazer upload do arquivo.' },
      { status: 500 }
    );
  }
}