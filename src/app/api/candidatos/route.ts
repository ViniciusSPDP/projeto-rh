// src/app/api/candidatos/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Rota para criar um candidato manualmente (via admin)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Remove campos vazios para não salvar strings vazias no banco,
    // permitindo que o Prisma use os valores padrão ou nulos do schema.
    const cleanBody: { [key: string]: any } = {};
    for (const key in body) {
      if (body[key] !== '' && body[key] !== null && body[key] !== undefined) {
        cleanBody[key] = body[key];
      }
    }

    const novoCandidato = await prisma.candidatos.create({
      data: cleanBody,
    });

    return NextResponse.json(novoCandidato, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar candidato manualmente:', error);
    // Adiciona mais detalhes do erro na resposta em caso de falha
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: 'Erro interno do servidor ao criar candidato.', details: errorMessage },
      { status: 500 }
    );
  }
}
