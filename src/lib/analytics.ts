// src/lib/analytics.ts

import { NextRequest } from 'next/server';
// CORREÇÃO 1: As importações foram separadas.
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Tipos para os eventos
export type TipoFormulario = 'upload_curriculo' | 'manual_dados';
export type TipoEvento = 'abertura' | 'preenchimento' | 'envio' | 'abandono';
export type EtapaFormulario = 'step_1' | 'step_2' | 'step_3' | 'upload' | 'dados_pessoais' | 'endereco' | 'profissional';

interface EventoAnalytics {
  sessionId: string;
  tipoForm: TipoFormulario;
  evento: TipoEvento;
  etapa?: EtapaFormulario;
  dadosExtra?: Record<string, unknown>;
  userAgent?: string;
  ip?: string;
}

interface DadosConversao {
  sessionId: string;
  tipoForm: TipoFormulario;
  evento: TipoEvento;
  etapa?: EtapaFormulario;
  tempoNaEtapa?: number;
  dadosExtra?: Record<string, unknown>;
}

class AnalyticsService {
  
  static gerarSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static extrairDadosRequisicao(request?: NextRequest) {
    if (!request) return {};
    return {
      userAgent: request.headers.get('user-agent') || undefined,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    };
  }

  static async registrarEvento(dados: EventoAnalytics): Promise<void> {
    try {
      await prisma.formularioAnalytics.create({
        data: {
          sessionId: dados.sessionId,
          tipoForm: dados.tipoForm,
          evento: dados.evento,
          etapa: dados.etapa,
          userAgent: dados.userAgent,
          ip: dados.ip,
          dadosEvento: (dados.dadosExtra || {}) as Prisma.JsonObject
        }
      });
      console.log(`[ANALYTICS] Evento registrado: ${dados.evento} - ${dados.tipoForm}`);
    } catch (error) {
      console.error('[ANALYTICS] Erro ao registrar evento:', error);
    }
  }

  static async atualizarConversao(dados: DadosConversao): Promise<void> {
    try {
      await prisma.conversaoFunil.upsert({
        where: { sessionId: dados.sessionId },
        update: {
          ...(dados.evento === 'preenchimento' && { preenchimentoAt: new Date() }),
          ...(dados.evento === 'envio' && { envioAt: new Date() }),
          ...(dados.evento === 'abandono' && { abandonouEm: dados.etapa }),
          ...(dados.etapa && { etapasVisitadas: { push: dados.etapa } }),
          // CORREÇÃO 2: A linha 'ultimoAcessoAt' foi removida pois o campo não existe no seu schema.
        },
        create: {
          sessionId: dados.sessionId,
          tipoForm: dados.tipoForm,
          aberturaAt: new Date(),
          etapasVisitadas: dados.etapa ? [dados.etapa] : [],
          ...(dados.evento === 'preenchimento' && { preenchimentoAt: new Date() }),
          ...(dados.evento === 'envio' && { envioAt: new Date() }),
          ...(dados.evento === 'abandono' && { abandonouEm: dados.etapa }),
        }
      });
      console.log(`[ANALYTICS] Conversão atualizada: ${dados.evento} - ${dados.sessionId}`);
    } catch (error) {
      console.error('[ANALYTICS] Erro ao atualizar conversão:', error);
    }
  }

  static async track(dados: DadosConversao & { userAgent?: string; ip?: string }): Promise<void> {
    await Promise.all([
      this.registrarEvento({
        sessionId: dados.sessionId,
        tipoForm: dados.tipoForm,
        evento: dados.evento,
        etapa: dados.etapa,
        dadosExtra: dados.dadosExtra,
        userAgent: dados.userAgent,
        ip: dados.ip
      }),
      this.atualizarConversao(dados)
    ]);
  }

  static async obterEstatisticas(periodo: 'hoje' | 'semana' | 'mes' | 'total' = 'mes') {
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

    const estatisticas = await Promise.all([
      this.obterEstatisticasFormulario('upload_curriculo', dataInicio),
      this.obterEstatisticasFormulario('manual_dados', dataInicio)
    ]);

    return {
      uploadCurriculo: estatisticas[0],
      manualDados: estatisticas[1],
      periodo,
      dataInicio,
      dataFim: agora
    };
  }

  private static async obterEstatisticasFormulario(tipo: TipoFormulario, dataInicio: Date) {
    const where = {
      tipoForm: tipo,
      createdAt: { gte: dataInicio }
    };

    const [aberturas, preenchimentos, envios, conversoes] = await Promise.all([
      prisma.conversaoFunil.count({
        where: { ...where, aberturaAt: { not: null } }
      }),
      prisma.conversaoFunil.count({
        where: { ...where, preenchimentoAt: { not: null } }
      }),
      prisma.conversaoFunil.count({
        where: { ...where, envioAt: { not: null } }
      }),
      prisma.conversaoFunil.findMany({
        where,
        select: {
          aberturaAt: true,
          preenchimentoAt: true,
          envioAt: true,
          tempoTotal: true,
          abandonouEm: true,
          etapasVisitadas: true
        }
      })
    ]);

    const taxaPreenchimento = aberturas > 0 ? (preenchimentos / aberturas) * 100 : 0;
    const taxaEnvio = preenchimentos > 0 ? (envios / preenchimentos) * 100 : 0;
    const taxaConversaoTotal = aberturas > 0 ? (envios / aberturas) * 100 : 0;

    const temposValidos = conversoes
      .filter(c => c.tempoTotal && c.tempoTotal > 0)
      .map(c => c.tempoTotal as number);
    
    const tempoMedio = temposValidos.length > 0 
      ? temposValidos.reduce((a, b) => a + b, 0) / temposValidos.length 
      : 0;

    const abandonos = conversoes
      .filter(c => c.abandonouEm)
      .reduce((acc, curr) => {
        const etapa = curr.abandonouEm as string;
        acc[etapa] = (acc[etapa] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      tipo,
      aberturas,
      preenchimentos,
      envios,
      taxaPreenchimento: Math.round(taxaPreenchimento * 100) / 100,
      taxaEnvio: Math.round(taxaEnvio * 100) / 100,
      taxaConversaoTotal: Math.round(taxaConversaoTotal * 100) / 100,
      tempoMedio: Math.round(tempoMedio),
      principaisAbandonos: Object.entries(abandonos)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([etapa, count]) => ({ etapa, count }))
    };
  }
}

export default AnalyticsService;