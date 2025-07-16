// src/app/api/curriculos/[filename]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { stat } from 'fs/promises';

// Função para obter o tipo de conteúdo (MIME type) com base na extensão do arquivo
function getContentType(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.pdf': return 'application/pdf';
    case '.doc': return 'application/msword';
    case '.docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    default: return 'application/octet-stream'; // Tipo genérico para download
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;

    // Medida de segurança para evitar que acessem outras pastas (Path Traversal)
    if (filename.includes('..') || filename.includes('/')) {
        return NextResponse.json({ error: 'Nome de arquivo inválido.' }, { status: 400 });
    }

    // Monta o caminho completo para o arquivo na pasta protegida
    const filePath = path.join(process.cwd(), 'uploads', 'curriculo', filename);

    // Verifica se o arquivo existe
    await stat(filePath);

    // Lê o arquivo do disco
    const fileBuffer = await fs.readFile(filePath);
    
    // Determina o tipo de conteúdo
    const contentType = getContentType(filename);

    // Retorna o arquivo com os headers corretos
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // 'inline' tenta abrir no navegador (bom para PDFs), 'attachment' força o download
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });

  } catch (error: unknown) { // CORREÇÃO: Trocado 'any' por 'unknown'
    // CORREÇÃO: Adicionado um type guard para verificar a estrutura do erro
    if (error && typeof error === 'object' && 'code' in error) {
      // Se o erro for de "Arquivo Não Encontrado", retorna um 404 amigável
      if (error.code === 'ENOENT') {
          return NextResponse.json({ error: 'Arquivo não encontrado.' }, { status: 404 });
      }
    }
    
    // Para todos os outros tipos de erro, loga e retorna um erro genérico
    console.error('Erro ao servir arquivo:', error);
    return NextResponse.json({ error: 'Falha ao acessar o arquivo.' }, { status: 500 });
  }
}