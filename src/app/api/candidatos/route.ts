// src/app/api/candidatos/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';
import { uploadBase64Image } from '@/lib/minio';
import { candidatoCreateSchema } from '@/lib/validation/candidato';

// Rota para criar um candidato manualmente (via admin)
export async function POST(req: NextRequest) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    // Whitelist Zod: só campos conhecidos chegam ao Prisma (anti mass-assignment).
    const parsed = candidatoCreateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    // Foto: base64/data URL sobe pro MinIO e guarda só a KEY (helper é idempotente).
    const fotoCandidato = await uploadBase64Image(parsed.data.fotoCandidato, 'fotos/candidatos');

    const novoCandidato = await prisma.candidatos.create({
      data: { ...parsed.data, fotoCandidato },
    });

    return NextResponse.json(
      { ...novoCandidato, idCandidato: novoCandidato.idCandidato.toString() },
      { status: 201 },
    );
  } catch (error) {
    // Detalhe do erro só no log do servidor; nunca vaza para o cliente.
    console.error('Erro ao criar candidato manualmente:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao criar candidato.' },
      { status: 500 },
    );
  }
}
