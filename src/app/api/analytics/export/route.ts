// src/app/api/analytics/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Definição das interfaces para tipagem forte
interface EventoParaCSV {
  sessionId: string;
  tipoForm: string;
  evento: string;
  etapa: string | null;
  data: Date;
  dadosEvento: unknown;
}

interface DadosParaExportCSV {
  eventos: EventoParaCSV[];
}

function convertToCSV(data: DadosParaExportCSV): string {
  const csvLines = [];
  
  // Header do CSV
  csvLines.push('TipoForm,SessionId,Evento,Etapa,Data,DadosExtra');
  
  // Linhas de dados dos eventos
  data.eventos.forEach((evento: EventoParaCSV) => {
    const linha = [
      evento.tipoForm,
      evento.sessionId,
      evento.evento,
      evento.etapa || '', // Garante que não haverá 'null' no CSV
      evento.data.toISOString(), // Usa .toISOString() para um formato de data padronizado
      JSON.stringify(evento.dadosEvento || {}) // Garante que o JSON é válido
    ];
    csvLines.push(linha.join(','));
  });
  
  return csvLines.join('\n');
}


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get('periodo') || 'mes';
    const formato = searchParams.get('formato') || 'json';

    const agora = new Date();
    let dataInicio: Date;

    switch (periodo) {
      case 'hoje':
        dataInicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
        break;
      case 'semana':
        dataInicio = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'mes':
        dataInicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
        break;
      default:
        dataInicio = new Date('2020-01-01');
    }

    const eventos = await prisma.formularioAnalytics.findMany({
      where: {
        createdAt: { gte: dataInicio }
      },
      orderBy: { createdAt: 'desc' },
      take: 1000
    });

    const conversoes = await prisma.conversaoFunil.findMany({
      where: {
        createdAt: { gte: dataInicio }
      },
      orderBy: { createdAt: 'desc' }
    });

    const dadosExport = {
      periodo,
      dataInicio,
      dataFim: agora,
      totalEventos: eventos.length,
      totalConversoes: conversoes.length,
      eventos: eventos.map(e => ({
        sessionId: e.sessionId,
        tipoForm: e.tipoForm,
        evento: e.evento,
        etapa: e.etapa,
        data: e.createdAt,
        dadosEvento: e.dadosEvento
      })),
      conversoes: conversoes.map(c => ({
        sessionId: c.sessionId,
        tipoForm: c.tipoForm,
        aberturaAt: c.aberturaAt,
        preenchimentoAt: c.preenchimentoAt,
        envioAt: c.envioAt,
        tempoTotal: c.tempoTotal,
        abandonouEm: c.abandonouEm,
        etapasVisitadas: c.etapasVisitadas
      }))
    };

    if (formato === 'csv') {
      // Agora 'dadosExport' é compatível com o tipo esperado pela função
      const csvContent = convertToCSV(dadosExport);
      
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="analytics-${periodo}-${agora.toISOString().split('T')[0]}.csv"`
        }
      });
    }

    return NextResponse.json(dadosExport, { status: 200 });

  } catch (error) {
    console.error('[ANALYTICS EXPORT] Erro:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({
      error: 'Erro interno do servidor',
      details: errorMessage
    }, { status: 500 });
  }
}