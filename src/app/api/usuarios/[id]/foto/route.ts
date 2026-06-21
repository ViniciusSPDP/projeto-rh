// src/app/api/usuarios/[id]/foto/route.ts
//
// Proxy AUTENTICADO para servir o avatar de um usuário (KEY do MinIO privado).
// Para o próprio avatar do usuário logado, use /api/user/avatar.

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/prisma';
import { getObjectBytes, contentTypeFromKey } from '@/lib/minio';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  const user = await prisma.usuario.findUnique({
    where: { id: Number(id) },
    select: { fotourl: true },
  });

  const key = user?.fotourl?.trim();
  if (!key || !key.startsWith('fotos/')) {
    return NextResponse.json({ error: 'Foto não encontrada' }, { status: 404 });
  }

  try {
    const bytes = await getObjectBytes(key);
    if (!bytes) {
      return NextResponse.json({ error: 'Foto não encontrada' }, { status: 404 });
    }
    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        'Content-Type': contentTypeFromKey(key),
        'Content-Length': String(bytes.byteLength),
        'Cache-Control': 'private, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err: unknown) {
    const e = err as { name?: string; $metadata?: { httpStatusCode?: number } };
    if (e.name === 'NoSuchKey' || e.$metadata?.httpStatusCode === 404) {
      return NextResponse.json({ error: 'Foto não encontrada' }, { status: 404 });
    }
    console.error('[FOTO USUARIO PROXY] erro:', err);
    return NextResponse.json({ error: 'Erro ao obter foto' }, { status: 500 });
  }
}
