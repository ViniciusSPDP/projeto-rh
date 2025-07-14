// src/app/api/templates/image/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // 1. Pega os dados enviados do frontend
    const body = await req.json();
    const { name, backgroundImageUrl, elements } = body;

    // 2. Validação básica dos dados
    if (!name || !backgroundImageUrl || !elements) {
      return NextResponse.json({ error: 'Dados incompletos para criar o template.' }, { status: 400 });
    }

    // 3. Usa o Prisma para criar o novo template no banco de dados
    const newTemplate = await prisma.imageTemplate.create({
      data: {
        name: name,
        backgroundImageUrl: backgroundImageUrl,
        elements: elements, // O Prisma lida com a conversão para o tipo JSON
      },
    });

    // 4. Retorna o template criado com sucesso
    return NextResponse.json(newTemplate, { status: 201 });

  } catch (error) {
    console.error('Erro ao salvar o template:', error);
    return NextResponse.json({ error: 'Falha ao salvar o template.' }, { status: 500 });
  }
}