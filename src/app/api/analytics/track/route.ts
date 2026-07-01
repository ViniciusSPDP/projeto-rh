// src/app/api/analytics/track/route.ts

import { NextRequest, NextResponse } from 'next/server';
import AnalyticsService from '@/lib/analytics';
import { rateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limit por IP (endpoint público de tracking): 60/min (generoso p/ eventos de funil).
  const rl = rateLimit('track:' + getClientIp(request), 60, 60_000);
  if (!rl.allowed) return rateLimitResponse(rl);
  try {
    const body = await request.json();
    const { sessionId, tipoForm, evento, etapa, dadosExtra } = body;

    // Validar dados obrigatórios
    if (!sessionId || !tipoForm || !evento) {
      return NextResponse.json({
        error: 'Dados obrigatórios: sessionId, tipoForm, evento'
      }, { status: 400 });
    }

    // Validar tipos
    if (!['upload_curriculo', 'manual_dados'].includes(tipoForm)) {
      return NextResponse.json({
        error: 'tipoForm deve ser "upload_curriculo" ou "manual_dados"'
      }, { status: 400 });
    }

    if (!['abertura', 'preenchimento', 'envio', 'abandono'].includes(evento)) {
      return NextResponse.json({
        error: 'evento deve ser "abertura", "preenchimento", "envio" ou "abandono"'
      }, { status: 400 });
    }

    // Extrair dados da requisição
    const dadosRequisicao = AnalyticsService.extrairDadosRequisicao(request);

    // Registrar evento
    await AnalyticsService.track({
      sessionId,
      tipoForm,
      evento,
      etapa,
      dadosExtra,
      ...dadosRequisicao
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('[ANALYTICS API] Erro:', error);
    return NextResponse.json({
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}



