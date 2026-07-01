// src/app/api/templates/image/route.ts

import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';
import { assertPublicHttpsUrl, CLOUDINARY_HOSTS } from '@/lib/url-guard';

export async function POST(req: Request) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    // 1. Pega os dados enviados do frontend
    const body = await req.json();
    const { name, backgroundImageUrl, elements } = body;

    // 2. Validação básica dos dados
    if (!name || !backgroundImageUrl || !elements) {
      return NextResponse.json({ error: 'Dados incompletos para criar o template.' }, { status: 400 });
    }

    // 2b. Anti-SSRF na origem: a imagem de fundo tem que ser HTTPS de um host permitido
    // (Cloudinary). Impede que se armazene uma URL apontando para rede interna/metadata.
    try {
      await assertPublicHttpsUrl(backgroundImageUrl, { allowedHosts: CLOUDINARY_HOSTS });
    } catch {
      return NextResponse.json({ error: 'URL de imagem de fundo inválida.' }, { status: 400 });
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

export async function GET() {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const templates = await prisma.imageTemplate.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Erro ao buscar templates:', error);
    return NextResponse.json({ error: 'Falha ao buscar os templates.' }, { status: 500 });
  }
}