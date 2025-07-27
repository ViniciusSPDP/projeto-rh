// Arquivo: src/app/api/upload/image/route.ts
// VERSÃO CORRIGIDA E COM TIPOS SEGUROS

import { NextResponse } from 'next/server';
// 1. Importamos o tipo 'UploadApiResponse' junto com o 'cloudinary'
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

// Configura a biblioteca do Cloudinary com as chaves do seu arquivo .env.local
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Função auxiliar para enviar o arquivo para o Cloudinary.
async function uploadToCloudinary(buffer: Buffer): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'rh_templates', 
      },
      (error, result) => {
        // O 'result' aqui é do tipo UploadApiResponse | undefined
        // Se o resultado existir, resolvemos a promise com ele.
        if (result) {
          return resolve(result);
        }
        // Se deu erro, rejeitamos a promise.
        if (error) {
          return reject(error);
        }
      }
    );
    uploadStream.end(buffer);
  });
}

// A função principal da nossa API
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const uploadResult = await uploadToCloudinary(buffer);

        // Agora 'uploadResult' é corretamente tipado como UploadApiResponse
        const publicUrl = uploadResult.secure_url;
        
        return NextResponse.json({ url: publicUrl }, { status: 201 });

    } catch (error) {
        console.error('Erro no upload da imagem:', error);
        return NextResponse.json({ error: 'Falha ao fazer upload da imagem.' }, { status: 500 });
    }
}
