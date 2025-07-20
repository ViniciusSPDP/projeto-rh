// src/hooks/useAnalytics.ts

'use client';

import { useEffect, useRef, useCallback } from 'react';

type TipoFormulario = 'upload_curriculo' | 'manual_dados';
type TipoEvento = 'abertura' | 'preenchimento' | 'envio' | 'abandono';
type EtapaFormulario = 'step_1' | 'step_2' | 'step_3' | 'upload' | 'dados_pessoais' | 'endereco' | 'profissional';

interface UseAnalyticsProps {
  tipoForm: TipoFormulario;
  sessionId?: string;
}

interface TrackEventProps {
  evento: TipoEvento;
  etapa?: EtapaFormulario;
  dadosExtra?: Record<string, unknown>;
}

export function useAnalytics({ tipoForm, sessionId: propSessionId }: UseAnalyticsProps) {
  const sessionIdRef = useRef<string>(propSessionId || '');
  const inicializadoRef = useRef(false);
  const tempoInicioRef = useRef<number>(Date.now());

  // Gerar session ID se não fornecido
  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }, []);

  // Função para enviar evento para a API
  const enviarEvento = useCallback(async (dados: TrackEventProps) => {
    try {
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          tipoForm,
          evento: dados.evento,
          etapa: dados.etapa,
          dadosExtra: {
            ...dados.dadosExtra,
            timestamp: Date.now(),
            tempoNaPagina: Date.now() - tempoInicioRef.current
          }
        }),
      });

      if (!response.ok) {
        console.warn('[ANALYTICS] Erro ao enviar evento:', response.statusText);
      }
    } catch (error) {
      console.warn('[ANALYTICS] Erro de rede:', error);
    }
  }, [tipoForm]);

  // Registrar abertura do formulário automaticamente
  useEffect(() => {
    if (!inicializadoRef.current) {
      inicializadoRef.current = true;
      enviarEvento({ evento: 'abertura' });
    }
  }, [enviarEvento]);

  // Registrar abandono quando o usuário sai da página
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Usar sendBeacon para garantir que o evento seja enviado
      navigator.sendBeacon('/api/analytics/track', JSON.stringify({
        sessionId: sessionIdRef.current,
        tipoForm,
        evento: 'abandono',
        dadosExtra: {
          tempoNaPagina: Date.now() - tempoInicioRef.current
        }
      }));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [tipoForm]);

  // Funções de tracking específicas
  const trackAbertura = useCallback((etapa?: EtapaFormulario) => {
    enviarEvento({ evento: 'abertura', etapa });
  }, [enviarEvento]);

  const trackPreenchimento = useCallback((etapa?: EtapaFormulario, dadosExtra?: Record<string, unknown>) => {
    enviarEvento({ evento: 'preenchimento', etapa, dadosExtra });
  }, [enviarEvento]);

  const trackEnvio = useCallback((dadosExtra?: Record<string, unknown>) => {
    enviarEvento({ 
      evento: 'envio', 
      dadosExtra: {
        ...dadosExtra,
        tempoTotal: Date.now() - tempoInicioRef.current
      }
    });
  }, [enviarEvento]);

  const trackAbandono = useCallback((etapa?: EtapaFormulario, dadosExtra?: Record<string, unknown>) => {
    enviarEvento({ evento: 'abandono', etapa, dadosExtra });
  }, [enviarEvento]);

  return {
    sessionId: sessionIdRef.current,
    trackAbertura,
    trackPreenchimento,
    trackEnvio,
    trackAbandono,
    track: enviarEvento
  };
}

// Hook específico para formulário multi-step
export function useStepAnalytics(tipoForm: TipoFormulario, etapaAtual: number) {
  const analytics = useAnalytics({ tipoForm });
  const etapaAnteriorRef = useRef<number>(0);

  useEffect(() => {
    if (etapaAtual !== etapaAnteriorRef.current && etapaAtual > 0) {
      const etapaNome = `step_${etapaAtual}` as EtapaFormulario;
      analytics.trackPreenchimento(etapaNome, { 
        etapaNumero: etapaAtual,
        direcao: etapaAtual > etapaAnteriorRef.current ? 'avancar' : 'voltar'
      });
      etapaAnteriorRef.current = etapaAtual;
    }
  }, [etapaAtual, analytics]);

  return analytics;
}