// src/app/api/analytics/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import AnalyticsService from '@/lib/analytics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get('periodo') as 'hoje' | 'semana' | 'mes' | 'total' || 'mes';

    const estatisticas = await AnalyticsService.obterEstatisticas(periodo);

    return NextResponse.json(estatisticas, { status: 200 });

  } catch (error) {
    console.error('[ANALYTICS STATS] Erro:', error);
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}
