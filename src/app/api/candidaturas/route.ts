// src/app/api/candidaturas/route.ts

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import prisma from '@/lib/prisma';
import { minioClient, bucketName } from '@/lib/minio'; // Cliente MinIO configurado
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extração dos campos do formulário
    const nomeCandidato = formData.get('nome') as string;
    const cpfCandidato = formData.get('cpf') as string;
    const emailCandidato = formData.get('email') as string;
    const telefoneCandidato = formData.get('telefone') as string;
    const vagainteresseCandidato = formData.get('cargo') as string;
    const cepCandidato = formData.get('cep') as string;
    const ruaCandidato = formData.get('rua') as string;
    const numeroCandidato = formData.get('numero') as string;
    const bairroCandidato = formData.get('bairro') as string;
    const cidadeCandidato = formData.get('cidade') as string;
    const estadoCandidato = formData.get('estado') as string;

    // --- VALIDAÇÃO DE SEGURANÇA DO ARQUIVO ---
    const curriculoFile = formData.get('curriculo') as File | null;

    if (!curriculoFile) {
      return NextResponse.json({ error: 'Currículo é obrigatório.' }, { status: 400 });
    }

    // 1. Validação de Tamanho (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Megabytes
    if (curriculoFile.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'Arquivo muito grande. O limite é 5MB.' }, { status: 400 });
    }

    // 2. Validação de Tipo (APENAS PDF)
    const ALLOWED_MIME_TYPES = ['application/pdf'];
    if (!ALLOWED_MIME_TYPES.includes(curriculoFile.type)) {
        return NextResponse.json({ error: 'Formato de arquivo inválido. Apenas arquivos PDF são permitidos.' }, { status: 400 });
    }

    // 3. Validação adicional da extensão do arquivo
    const originalName = curriculoFile.name;
    const fileExtension = path.extname(originalName).toLowerCase();
    if (fileExtension !== '.pdf') {
        return NextResponse.json({ error: 'Apenas arquivos com extensão .pdf são permitidos.' }, { status: 400 });
    }
    // --- FIM DA VALIDAÇÃO ---

    // 4. Preparar o arquivo para Upload (Buffer)
    const arrayBuffer = await curriculoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 5. Gerar nome único para o arquivo no Object Storage
    // Usamos Hash para evitar colisão e caracteres especiais
    const sanitizedCpf = cpfCandidato.replace(/\D/g, ''); 
    const randomHash = crypto.randomBytes(8).toString('hex');
    const filename = `curriculos/${sanitizedCpf}-${randomHash}.pdf`;
    
    // 6. Verificar se bucket existe (e criar se necessário)
    // Isso garante que o upload não falhe no primeiro uso
    const bucketExists = await minioClient.bucketExists(bucketName);
    
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, 'us-east-1');
      
      // Define política pública (opcional - depende se quer os arquivos acessíveis via URL direta)
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
      console.log(`[MINIO] Bucket '${bucketName}' criado com sucesso.`);
    }

    // 7. Enviar arquivo para o MinIO
    const metaData = {
      'Content-Type': 'application/pdf',
      'X-Original-Name': originalName
    };

    await minioClient.putObject(
      bucketName,
      filename,
      buffer,
      buffer.length,
      metaData
    );
    console.log(`[UPLOAD MINIO] Arquivo salvo: ${filename}`);

    // 8. Construir a URL Pública do MinIO
    const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
    const host = process.env.MINIO_ENDPOINT || 'localhost';
    
    // URL Final: http://localhost:9000/nome-do-bucket/curriculos/cpf-hash.pdf
    const curriculoUrl = `${protocol}://${host}/${bucketName}/${filename}`;

    // 9. Criar o registro do candidato no banco de dados com a nova URL
    const novoCandidato = await prisma.candidatos.create({
      data: {
        nomeCandidato,
        cpfCandidato,
        emailCandidato,
        telefoneCandidato,
        vagainteresseCandidato,
        cepCandidato,
        ruaCandidato,
        numeroCandidato,
        bairroCandidato,
        cidadeCandidato,
        estadoCandidato,
        curriculoUrl, // Salva a URL do MinIO
        situacaoCandidato: 'Em análise',
      }
    });

    console.log(`[DB] Candidato criado com ID: ${novoCandidato.idCandidato}`);
    
    return NextResponse.json({
      ...novoCandidato,
      // Serializa BigInt para string para evitar erro no JSON
      idCandidato: novoCandidato.idCandidato.toString(),
      message: 'Candidatura criada com sucesso!'
    }, { status: 201 });

  } catch (error) {
    console.error('[ERRO API] Falha ao processar candidatura:', error);
    return NextResponse.json({ 
      error: 'Falha ao criar candidatura. Tente novamente.' 
    }, { status: 500 });
  }
}