// src/app/api/candidaturas/route.ts

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import prisma from '@/lib/prisma';
import { s3Client, bucketName, ensureBucketExists } from '@/lib/minio';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';
import { isPdfBuffer } from '@/lib/pdf';

// Interface para tipar o erro da AWS de forma segura
interface AwsError {
  Code?: string;
  message?: string;
}

export async function POST(req: NextRequest) {
  // Rate limit por IP (upload público e caro): 5/min.
  const rl = rateLimit('candidatura:' + getClientIp(req), 5, 60_000);
  if (!rl.allowed) return rateLimitResponse(rl);
  try {
    const formData = await req.formData();

    // Extração dos campos do formulário
    const nomeCandidato = formData.get('nome') as string;
    const emailCandidato = formData.get('email') as string;
    const telefoneCandidato = formData.get('telefone') as string;
    const vagainteresseCandidato = formData.get('cargo') as string;
    const cepCandidato = formData.get('cep') as string;
    const ruaCandidato = formData.get('rua') as string;
    const numeroCandidato = formData.get('numero') as string;
    const bairroCandidato = formData.get('bairro') as string;
    const cidadeCandidato = formData.get('cidade') as string;
    const estadoCandidato = formData.get('estado') as string;

    // --- CONSENTIMENTO LGPD (obrigatório, validado no backend) ---
    if (formData.get('consentimento') !== 'true') {
      return NextResponse.json(
        { error: 'É necessário aceitar a Política de Privacidade para enviar a candidatura.' },
        { status: 400 }
      );
    }

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

    // 4b. Magic bytes: o conteúdo tem que começar com "%PDF-" (não confia só no
    // mime/extensão, que são forjáveis).
    if (!isPdfBuffer(buffer)) {
      return NextResponse.json({ error: 'O arquivo enviado não é um PDF válido.' }, { status: 400 });
    }

    // 5. Gerar nome único para o arquivo usando o telefone como base
    const sanitizedPhone = telefoneCandidato.replace(/\D/g, ''); 
    const randomHash = crypto.randomBytes(8).toString('hex');
    const filename = `curriculos/${sanitizedPhone}-${randomHash}.pdf`;
    
    // 6. Verificar se bucket existe (usando o helper novo)
    await ensureBucketExists();

    // 7. Enviar arquivo para o MinIO usando AWS SDK
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: buffer,
      ContentType: 'application/pdf',
      Metadata: {
        'original-name': encodeURIComponent(originalName) 
      }
    });

    await s3Client.send(command);
    
    console.log(`[UPLOAD MINIO] Arquivo salvo: ${filename}`);

    // 8. Salvar apenas a KEY do objeto (não a URL).
    // O bucket é PRIVADO: o currículo é exibido via proxy autenticado
    // (/api/candidatos/[id]/curriculo), que gera o acesso na hora a partir da key.
    const curriculoUrl = filename;

    // 9. Criar o registro do candidato no banco de dados
    const novoCandidato = await prisma.candidatos.create({
      data: {
        nomeCandidato,
        emailCandidato,
        telefoneCandidato,
        vagainteresseCandidato,
        cepCandidato,
        ruaCandidato,
        numeroCandidato,
        bairroCandidato,
        cidadeCandidato,
        estadoCandidato,
        curriculoUrl,
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
    
    // Log detalhado do erro AWS com tipagem segura
    const awsError = error as AwsError;
    if (awsError?.Code) {
         console.error('AWS Error Code:', awsError.Code);
         console.error('AWS Error Message:', awsError.message);
    }

    return NextResponse.json({ 
      error: 'Falha ao criar candidatura. Tente novamente.' 
    }, { status: 500 });
  }
}