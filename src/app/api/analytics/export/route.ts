// src/app/api/analytics/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

    // Buscar dados detalhados
    const eventos = await prisma.formularioAnalytics.findMany({
      where: {
        createdAt: { gte: dataInicio }
      },
      orderBy: { createdAt: 'desc' },
      take: 1000 // Limitar a 1000 registros
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
      // Converter para CSV
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
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

function convertToCSV(data: any): string {
  const csvLines = [];
  
  // Header
  csvLines.push('Tipo,SessionId,Evento,Etapa,Data,DadosExtra');
  
  // Eventos
  data.eventos.forEach((evento: any) => {
    csvLines.push([
      evento.tipoForm,
      evento.sessionId,
      evento.evento,
      evento.etapa || '',
      evento.data,
      JSON.stringify(evento.dadosEvento || {})
    ].join(','));
  });
  
  return csvLines.join('\n');
}