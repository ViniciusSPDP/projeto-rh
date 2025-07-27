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
    const fileExtension = path.extname(curriculoFile.name).toLowerCase();
    if (fileExtension !== '.pdf') {
        return NextResponse.json({ error: 'Apenas arquivos com extensão .pdf são permitidos.' }, { status: 400 });
    }
    // --- FIM DA VALIDAÇÃO ---

    // 4. Criar nome único para o arquivo
    const timestamp = Date.now();
    const sanitizedCpf = cpfCandidato.replace(/\D/g, ''); // Remove caracteres especiais do CPF
    const filename = `curriculo-${sanitizedCpf}-${timestamp}.pdf`;
    
    // 5. Definir diretório de upload
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'curriculos');

    // 6. Criar diretório se não existir
    try {
      await stat(uploadDir);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        await mkdir(uploadDir, { recursive: true });
        console.log(`[UPLOAD] Diretório criado: ${uploadDir}`);
      } else {
        console.error('[UPLOAD] Erro ao verificar diretório:', error);
        throw error;
      }
    }

    // 7. Salvar arquivo
    const buffer = Buffer.from(await curriculoFile.arrayBuffer());
    const filePath = path.join(uploadDir, filename);
    
    await writeFile(filePath, buffer);
    console.log(`[UPLOAD] Arquivo salvo em: ${filePath}`);

    // 8. URL relativa para salvar no banco (será acessível via /uploads/curriculos/filename.pdf)
    const curriculoUrl = `/uploads/curriculos/${filename}`;

    // 9. Criar o registro do candidato no banco de dados
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
        curriculoUrl,
        situacaoCandidato: 'Em análise',
      }
    });

    console.log(`[UPLOAD] Candidato criado com ID: ${novoCandidato.idCandidato}`);
    
    return NextResponse.json({
      ...novoCandidato,
      message: 'Candidatura criada com sucesso!'
    }, { status: 201 });

  } catch (error) {
    console.error('[UPLOAD] Erro ao criar candidatura:', error);
    return NextResponse.json({ 
      error: 'Falha ao criar candidatura. Tente novamente.' 
    }, { status: 500 });
  }
}