// src/app/api/curriculos/[filename]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-guard';
import path from 'path';
import { readFile, stat } from 'fs/promises';

// Função para obter o tipo de conteúdo (MIME type) com base na extensão do arquivo
function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.pdf': 
      return 'application/pdf';
    default: 
      return 'application/octet-stream';
  }
}

// Função para validar se o nome do arquivo é seguro
function isValidFilename(filename: string): boolean {
  // Verificar se contém caracteres perigosos (path traversal)
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return false;
  }
  
  // Verificar se é apenas PDF
  if (!filename.toLowerCase().endsWith('.pdf')) {
    return false;
  }
  
  // Verificar se segue o padrão esperado: curriculo-{dados}-{timestamp}.pdf
  const pattern = /^curriculo-[\w\d]+-\d+\.pdf$/;
  return pattern.test(filename);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const { filename } = params;
    
    console.log(`[CURRICULO API] Requisição para arquivo: ${filename}`);

    // Validação de segurança do nome do arquivo
    if (!isValidFilename(filename)) {
      console.log(`[CURRICULO API] Nome de arquivo inválido: ${filename}`);
      return NextResponse.json({ 
        error: 'Nome de arquivo inválido.' 
      }, { status: 400 });
    }

    // Construir o caminho do arquivo
    const filePath = path.join(process.cwd(), 'public', 'uploads', 'curriculos', filename);
    console.log(`[CURRICULO API] Caminho do arquivo: ${filePath}`);

    // Verificar se o arquivo existe
    try {
      await stat(filePath);
    } catch (error: unknown) {
      console.log(`[CURRICULO API] Arquivo não encontrado: ${filePath} - Erro:`, error);
      return NextResponse.json({ 
        error: 'Arquivo não encontrado.' 
      }, { status: 404 });
    }

    // Ler o arquivo
    const fileBuffer = await readFile(filePath);
    console.log(`[CURRICULO API] Arquivo lido com sucesso. Tamanho: ${fileBuffer.length} bytes`);
    
    // Determinar o tipo de conteúdo
    const contentType = getContentType(filename);
    
    // Headers para o response
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Length', fileBuffer.length.toString());
    headers.set('Cache-Control', 'public, max-age=3600');
    headers.set('Content-Disposition', `inline; filename="${filename}"`);
    
    // Para PDFs, adicionar headers específicos
    if (contentType === 'application/pdf') {
      headers.set('Accept-Ranges', 'bytes');
      headers.set('X-Content-Type-Options', 'nosniff');
    }

    console.log(`[CURRICULO API] Enviando arquivo ${filename} (${contentType})`);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: headers,
    });

  } catch (error: unknown) {
    console.error('[CURRICULO API] Erro interno:', error);
    
    // Log detalhado do erro para debug
    if (error instanceof Error) {
      console.error('[CURRICULO API] Erro detalhado:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    
    return NextResponse.json({ 
      error: 'Erro interno do servidor ao acessar o arquivo.' 
    }, { status: 500 });
  }
}

// Método HEAD para verificar se o arquivo existe sem baixá-lo
export async function HEAD(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  // Currículos são PII: o HEAD precisa da mesma checagem de sessão do GET,
  // senão vira um oráculo de existência de arquivo sem autenticação.
  const session = await requireSession();
  if (!session) return new NextResponse(null, { status: 401 });
  try {
    const { filename } = params;

    if (!isValidFilename(filename)) {
      return new NextResponse(null, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', 'curriculos', filename);
    
    try {
      const stats = await stat(filePath);
      const headers = new Headers();
      headers.set('Content-Type', getContentType(filename));
      headers.set('Content-Length', stats.size.toString());
      
      return new NextResponse(null, {
        status: 200,
        headers: headers,
      });
    } catch {
      return new NextResponse(null, { status: 404 });
    }
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}