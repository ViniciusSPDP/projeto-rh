// src/lib/analytics.ts

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

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
  
  // Gerar ID de sessão único
  static gerarSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Extrair dados da requisição
  static extrairDadosRequisicao(request?: NextRequest) {
    if (!request) return {};
    
    return {
      userAgent: request.headers.get('user-agent') || undefined,
      ip: request.headers.get('x-forwarded-for') || 
          request.headers.get('x-real-ip') || 
          'unknown'
    };
  }

  // Registrar evento de analytics
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
          dadosEvento: dados.dadosExtra || {}
        }
      });

      console.log(`[ANALYTICS] Evento registrado: ${dados.evento} - ${dados.tipoForm}`);
    } catch (error) {
      console.error('[ANALYTICS] Erro ao registrar evento:', error);
    }
  }

  // Atualizar funil de conversão
  static async atualizarConversao(dados: DadosConversao): Promise<void> {
    try {
      const agora = new Date();
      
      // Buscar registro existente ou criar novo
      const conversaoExistente = await prisma.conversaoFunil.findUnique({
        where: { sessionId: dados.sessionId }
      });

      if (conversaoExistente) {
        // Atualizar registro existente
        const updateData: Record<string, unknown> = {};
        
        switch (dados.evento) {
          case 'abertura':
            if (!conversaoExistente.aberturaAt) {
              updateData.aberturaAt = agora;
            }
            break;
          case 'preenchimento':
            updateData.preenchimentoAt = agora;
            if (dados.etapa) {
              const etapasVisitadas = (conversaoExistente.etapasVisitadas as string[]) || [];
              if (!etapasVisitadas.includes(dados.etapa)) {
                etapasVisitadas.push(dados.etapa);
                updateData.etapasVisitadas = etapasVisitadas;
              }
            }
            break;
          case 'envio':
            updateData.envioAt = agora;
            if (conversaoExistente.aberturaAt) {
              updateData.tempoTotal = Math.floor(
                (agora.getTime() - conversaoExistente.aberturaAt.getTime()) / 1000
              );
            }
            break;
          case 'abandono':
            updateData.abandonouEm = dados.etapa;
            break;
        }

        await prisma.conversaoFunil.update({
          where: { sessionId: dados.sessionId },
          data: updateData
        });

      } else {
        // Criar novo registro
        await prisma.conversaoFunil.create({
          data: {
            sessionId: dados.sessionId,
            tipoForm: dados.tipoForm,
            aberturaAt: dados.evento === 'abertura' ? agora : undefined,
            preenchimentoAt: dados.evento === 'preenchimento' ? agora : undefined,
            envioAt: dados.evento === 'envio' ? agora : undefined,
            etapasVisitadas: dados.etapa ? [dados.etapa] : [],
            abandonouEm: dados.evento === 'abandono' ? dados.etapa : undefined
          }
        });
      }

      console.log(`[ANALYTICS] Conversão atualizada: ${dados.evento} - ${dados.sessionId}`);
    } catch (error) {
      console.error('[ANALYTICS] Erro ao atualizar conversão:', error);
    }
  }

  // Método combinado para registrar evento e atualizar conversão
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

  // Obter estatísticas do funil
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
        dataInicio = new Date('2020-01-01'); // Data muito antiga para pegar tudo
    }

    // Estatísticas por tipo de formulário
    const estatisticas = await Promise.all([
      // Upload de currículo
      this.obterEstatisticasFormulario('upload_curriculo', dataInicio),
      // Preenchimento manual
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
      // Total de aberturas
      prisma.conversaoFunil.count({
        where: { ...where, aberturaAt: { not: null } }
      }),
      
      // Total de preenchimentos (começaram a preencher)
      prisma.conversaoFunil.count({
        where: { ...where, preenchimentoAt: { not: null } }
      }),
      
      // Total de envios (completaram)
      prisma.conversaoFunil.count({
        where: { ...where, envioAt: { not: null } }
      }),

      // Dados detalhados das conversões
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

    // Calcular taxas de conversão
    const taxaPreenchimento = aberturas > 0 ? (preenchimentos / aberturas) * 100 : 0;
    const taxaEnvio = preenchimentos > 0 ? (envios / preenchimentos) * 100 : 0;
    const taxaConversaoTotal = aberturas > 0 ? (envios / aberturas) * 100 : 0;

    // Tempo médio de preenchimento
    const temposValidos = conversoes
      .filter(c => c.tempoTotal && c.tempoTotal > 0)
      .map(c => c.tempoTotal as number);
    
    const tempoMedio = temposValidos.length > 0 
      ? temposValidos.reduce((a, b) => a + b, 0) / temposValidos.length 
      : 0;

    // Principais pontos de abandono
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