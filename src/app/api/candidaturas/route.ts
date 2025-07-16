// src/app/api/candidaturas/route.ts

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { writeFile, stat, mkdir } from 'fs/promises';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

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

    // 1. Validação de Tamanho (ex: 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Megabytes
    if (curriculoFile.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'Arquivo muito grande. O limite é 5MB.' }, { status: 400 });
    }

    // 2. Validação de Tipo (MIME Type)
    const ALLOWED_MIME_TYPES = [
        'application/pdf'
    ];
    if (!ALLOWED_MIME_TYPES.includes(curriculoFile.type)) {
        return NextResponse.json({ error: 'Formato de arquivo inválido. Apenas PDF são permitidos.' }, { status: 400 });
    }
    // --- FIM DA VALIDAÇÃO ---


    // 3. Salvar o arquivo do currículo no servidor
    const buffer = Buffer.from(await curriculoFile.arrayBuffer());
    const filename = `curriculo-${Date.now()}${path.extname(curriculoFile.name)}`;
    const uploadDir = path.join(process.cwd(), 'public', 'curriculo');

    try {
      await stat(uploadDir);
    } catch (error: unknown) {
      // Correção do 'any' para 'unknown' com type guard
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        await mkdir(uploadDir, { recursive: true });
      } else {
        throw error;
      }
    }

    await writeFile(path.join(uploadDir, filename), buffer);
    const curriculoUrl = `/curriculo/${filename}`;

    // 4. Criar o registro do candidato no banco de dados
    const novoCandidato = await prisma.candidatos.create({
      data: {
        // ... (todos os seus campos de dados aqui)
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
        // ... etc
        curriculoUrl,
        situacaoCandidato: 'Em análise',
      }
    });

    return NextResponse.json(novoCandidato, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar candidatura:', error);
    return NextResponse.json({ error: 'Falha ao criar candidatura.' }, { status: 500 });
  }
}