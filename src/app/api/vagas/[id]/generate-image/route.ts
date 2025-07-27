// src/app/api/vagas/[id]/generate-image/route.ts

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import prisma from '@/lib/prisma';

// --- TIPAGEM ATUALIZADA ---
interface TextElement {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fill: string;
  fontFamily?: string;
  fontStyle?: string;
  
  // NOVAS PROPRIEDADES para área delimitada
  width?: number;           // Largura da área de texto
  height?: number;          // Altura da área de texto  
  align?: 'left' | 'center' | 'right';  // Alinhamento horizontal
  verticalAlign?: 'top' | 'middle' | 'bottom'; // Alinhamento vertical
  padding?: number;         // Padding interno da área
  wrap?: 'word' | 'char' | 'none'; // Tipo de quebra de linha
  
  // Controles visuais da área
  showBounds?: boolean;     // Mostrar bordas da área
  boundsColor?: string;     // Cor das bordas da área
}

interface VagaData {
  titulo: string;
  descricao?: string | null;
}

// --- FUNÇÕES AUXILIARES ---
function replacePlaceholders(text: string, vaga: VagaData): string {
    return text
        .replace(/{titulo}/g, vaga.titulo || '')
        .replace(/{descricao}/g, vaga.descricao || '')
        .replace(/{empresa}/g, 'Sua Empresa'); // Adicione mais variáveis conforme necessário
}

function escapeHtml(unsafe: string): string {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// Função para calcular largura aproximada do texto (mais precisa)
function getApproximateTextWidth(text: string, fontSize: number, fontFamily: string = 'Arial'): number {
  // Valores mais precisos baseados em testes reais
  const fontWidthMultipliers: { [key: string]: number } = {
    'Arial': 0.55,
    'Helvetica': 0.55,
    'Georgia': 0.6,
    'Times New Roman': 0.5,
    'Verdana': 0.6,
    'Courier New': 0.6
  };
  
  const multiplier = fontWidthMultipliers[fontFamily] || 0.55;
  return text.length * fontSize * multiplier;
}

// Função para quebrar texto em linhas (igual ao frontend)
function wrapText(text: string, maxWidth: number, fontSize: number, fontFamily: string = 'Arial'): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const lineWidth = getApproximateTextWidth(testLine, fontSize, fontFamily);
    
    if (lineWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines.length > 0 ? lines : [text];
}

// Função para calcular offset vertical (igual ao frontend)
function calculateVerticalOffset(
  element: TextElement, 
  totalTextHeight: number
): number {
  const height = element.height || 100;
  const padding = element.padding || 10;
  const availableHeight = height - (padding * 2);
  
  switch (element.verticalAlign) {
    case 'middle':
      return (availableHeight - totalTextHeight) / 2;
    case 'bottom':
      return availableHeight - totalTextHeight;
    case 'top':
    default:
      return 0;
  }
}

// Função para processar elemento com área delimitada
function processTextElement(element: TextElement, vaga: VagaData): string {
  const processedText = replacePlaceholders(element.text, vaga);
  
  // Valores padrão
  const width = element.width || 300;
  //const height = element.height || 100;
  const padding = element.padding || 10;
  const align = element.align || 'left';
  
  // Área disponível para texto
  const maxTextWidth = width - (padding * 2);
  
  // Quebrar texto em linhas
  const lines = wrapText(processedText, maxTextWidth, element.fontSize, element.fontFamily || 'Arial');
  
  // Calcular altura e posicionamento
  const lineHeight = element.fontSize * 1.2;
  const totalTextHeight = lines.length * lineHeight;
  const verticalOffset = calculateVerticalOffset(element, totalTextHeight);
  
  // Processar estilo da fonte
  let fontWeight = 'normal';
  let fontStyle = 'normal';
  
  if (element.fontStyle?.includes('bold')) {
    fontWeight = 'bold';
  }
  if (element.fontStyle?.includes('italic')) {
    fontStyle = 'italic';
  }
  
  // Gerar SVG para cada linha
  const textElements = lines.map((line, index) => {
    const safeText = escapeHtml(line);
    
    // Calcular posições
    let textX = element.x + padding;
    const textY = element.y + padding + verticalOffset + (index * lineHeight) + (lineHeight * 0.8);
    
    // Ajustar X baseado no alinhamento
    if (align === 'center') {
      textX = element.x + (width / 2);
    } else if (align === 'right') {
      textX = element.x + width - padding;
    }
    
    return `<text x="${textX}" y="${textY}" font-size="${element.fontSize}" fill="${element.fill}" font-family="${element.fontFamily || 'Arial, sans-serif'}" font-weight="${fontWeight}" font-style="${fontStyle}" text-anchor="${align === 'center' ? 'middle' : align === 'right' ? 'end' : 'start'}">${safeText}</text>`;
  });
  
  return textElements.join('');
}

// --- ROTA PRINCIPAL DA API ---
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } } 
) {
  try {
    // 1. EXTRAÇÃO E VALIDAÇÃO DOS PARÂMETROS
    const vagaIdString = params.id;
    const templateId = request.nextUrl.searchParams.get('templateId');

    if (!templateId) {
      return NextResponse.json({ error: 'ID do template é obrigatório' }, { status: 400 });
    }

    // Converter ID da vaga para número
    const vagaId = parseInt(vagaIdString, 10);
    if (isNaN(vagaId)) {
        return NextResponse.json({ error: 'O ID da vaga fornecido não é um número válido.' }, { status: 400 });
    }

    // 2. BUSCA DOS DADOS NO BANCO DE DADOS
    const [vaga, template] = await Promise.all([
        prisma.vaga.findUnique({ where: { idVaga: vagaId } }),
        prisma.imageTemplate.findUnique({ where: { id: templateId } })
    ]);

    if (!vaga) {
      return NextResponse.json({ error: `Vaga com ID ${vagaId} não encontrada.` }, { status: 404 });
    }
    if (!template) {
        return NextResponse.json({ error: `Template com ID ${templateId} não encontrado.` }, { status: 404 });
    }

    // 3. BUSCA DA IMAGEM DE FUNDO DO CLOUDINARY
    const backgroundUrl = template.backgroundImageUrl;
    const backgroundResponse = await fetch(backgroundUrl);
    if (!backgroundResponse.ok) {
        throw new Error(`Falha ao buscar imagem de fundo do Cloudinary. Status: ${backgroundResponse.status}`);
    }
    const backgroundImageBuffer = Buffer.from(await backgroundResponse.arrayBuffer());

    // 4. PROCESSAMENTO DOS ELEMENTOS DE TEXTO
    const elements = template.elements as unknown as TextElement[];
    
    const metadata = await sharp(backgroundImageBuffer).metadata();
    const width = metadata.width || 1200;
    const height = metadata.height || 630;

    // USAR A FUNÇÃO PRINCIPAL
    const svgElements = elements.map(element => processTextElement(element, vaga)).join('');

    const svgOverlay = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${svgElements}</svg>`;

    console.log('SVG gerado:', svgOverlay); // Debug

    // 5. COMPOSIÇÃO DA IMAGEM FINAL COM SHARP
    const finalImageBuffer = await sharp(backgroundImageBuffer)
      .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
      .png()
      .toBuffer();

    // 6. RETORNO DA IMAGEM GERADA
    return new NextResponse(finalImageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="vaga-${vagaId}.png"`,
        'Cache-Control': 'public, max-age=3600', // Cache por 1 hora
      },
    });

  } catch (error) {
    console.error('Erro ao gerar imagem:', error);
    return NextResponse.json({ 
      error: 'Falha interna ao gerar a imagem.',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 });
  }
}