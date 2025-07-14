// src/app/api/vagas/[id]/generate-image/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

interface TextElement {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fill: string;
}

function escapeHtml(unsafe: string): string {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } } 
) {
  try {
    const { id: vagaId } = params; 
    const templateId = request.nextUrl.searchParams.get('templateId');

    if (!templateId) {
      return NextResponse.json({ error: 'ID do template é obrigatório' }, { status: 400 });
    }

    const numericVagaId = parseInt(vagaId, 10);

    if (isNaN(numericVagaId)) {
      return NextResponse.json({ error: 'O ID da vaga fornecido não é um número válido.' }, { status: 400 });
    }

    const vaga = await prisma.vaga.findUnique({
      where: { idVaga: numericVagaId }
    });
    
    const template = await prisma.imageTemplate.findUnique({ where: { id: templateId } });

    if (!vaga || !template) {
      return NextResponse.json({ error: 'Vaga ou Template não encontrado' }, { status: 404 });
    }

    const backgroundPath = path.join(process.cwd(), 'public', template.backgroundImageUrl);
    const backgroundImageBuffer = await fs.readFile(backgroundPath);

    const elements = template.elements as unknown as TextElement[];
    
    const metadata = await sharp(backgroundImageBuffer).metadata();
    const width = metadata.width || 800;
    const height = metadata.height || 600;

    const svgElements = elements.map(el => {
      let processedText = el.text.replace(/{titulo}/g, vaga.titulo || '');
      processedText = processedText.replace(/{descricao}/g, vaga.descricao || '');
      const safeText = escapeHtml(processedText);
      return `<text x="${el.x}" y="${el.y + el.fontSize}" font-size="${el.fontSize}" fill="${el.fill}" font-family="Arial, sans-serif">${safeText}</text>`;
    }).join('');

    const svgOverlay = `<svg width="${width}" height="${height}">${svgElements}</svg>`;

    const finalImageBuffer = await sharp(backgroundImageBuffer)
      .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
      .png()
      .toBuffer();

    return new NextResponse(finalImageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="vaga-${vagaId}.png"`,
      },
    });

  } catch (error) {
    console.error('Erro ao gerar imagem:', error);
    return NextResponse.json({ error: 'Falha ao gerar a imagem.' }, { status: 500 });
  }
}