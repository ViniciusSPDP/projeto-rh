// src/app/api/candidatos/[id]/curriculo/route.ts
//
// Proxy AUTENTICADO para servir o currículo (PDF) de um candidato a partir do
// bucket MinIO PRIVADO. Substitui o acesso por URL pública crua.
//
// Fluxo: valida sessão (NextAuth) -> busca a KEY do objeto pelo id do candidato
// -> baixa o objeto via credenciais server-side -> faz stream do PDF inline.
// Como o middleware NÃO cobre /api, a checagem de sessão é feita aqui.

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { s3Client, bucketName, extractObjectKey } from '@/lib/minio';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export const runtime = 'nodejs';        // aws-sdk + Buffer exigem runtime Node (não Edge)
export const dynamic = 'force-dynamic'; // resposta depende da sessão; nunca pré-renderizar/cachear

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  // 1. Autenticação (o middleware não protege rotas /api)
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  // 2. Validação do id
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  // 3. Buscar a KEY do currículo a partir do candidato
  let candidato: { curriculoUrl: string | null } | null;
  try {
    candidato = await prisma.candidatos.findUnique({
      where: { idCandidato: BigInt(id) },
      select: { curriculoUrl: true },
    });
  } catch {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  if (!candidato?.curriculoUrl?.trim()) {
    return NextResponse.json({ error: 'Currículo não encontrado' }, { status: 404 });
  }

  const key = extractObjectKey(candidato.curriculoUrl);
  if (!key) {
    // Valor não corresponde a um objeto deste bucket (ex.: legado em disco)
    return NextResponse.json({ error: 'Currículo não encontrado' }, { status: 404 });
  }

  // 4. Baixar o objeto do MinIO e fazer stream (PDFs ≤5MB: buffer é suficiente e robusto)
  try {
    const obj = await s3Client.send(
      new GetObjectCommand({ Bucket: bucketName, Key: key })
    );

    if (!obj.Body) {
      return NextResponse.json({ error: 'Currículo não encontrado' }, { status: 404 });
    }

    const bytes = await obj.Body.transformToByteArray();

    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': String(bytes.byteLength),
        'Content-Disposition': 'inline; filename="curriculo.pdf"',
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err: unknown) {
    const e = err as { name?: string; $metadata?: { httpStatusCode?: number } };
    if (e.name === 'NoSuchKey' || e.$metadata?.httpStatusCode === 404) {
      return NextResponse.json({ error: 'Currículo não encontrado' }, { status: 404 });
    }
    console.error('[CURRICULO PROXY] Erro ao obter currículo:', err);
    return NextResponse.json({ error: 'Erro ao obter currículo' }, { status: 500 });
  }
}
