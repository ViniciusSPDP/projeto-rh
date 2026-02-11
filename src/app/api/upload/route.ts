// Arquivo: src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
// Atualizamos as importações para usar o que foi exportado no novo lib/minio.ts
import { s3Client, bucketName, ensureBucketExists, minioBaseUrl } from '@/lib/minio';
import { PutObjectCommand } from '@aws-sdk/client-s3';
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
    // Usamos ?. para evitar erro se não tiver extensão
    const fileExtension = file.name.split('.').pop() || 'bin'; 
    const randomName = crypto.randomBytes(16).toString('hex');
    const fileName = `${randomName}.${fileExtension}`;

    // 3. Verificar se bucket existe (Usando o helper atualizado)
    await ensureBucketExists();

    // 4. Enviar para o MinIO (Usando o AWS SDK S3)
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      // ACL: 'public-read' // Opcional, já que definimos a policy no ensureBucketExists
    });

    await s3Client.send(command);

    // 5. Construir a URL Pública
    // Usamos a variável centralizada minioBaseUrl para evitar erros de concatenação
    const publicUrl = `${minioBaseUrl}/${bucketName}/${fileName}`;

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