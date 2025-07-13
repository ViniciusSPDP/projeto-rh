// src/app/integracoes/whatsapp/etapas/page.tsx

'use client';

import { useState, useEffect } from 'react';
import type { EtapasConfig, TemplateEtapa } from '@/types/configuracoes';
import { Loader2, CheckCircle, Save, ToggleLeft, ToggleRight, AlertTriangle, Timer, Workflow, ChevronDown } from 'lucide-react';

const ETAPAS_DO_PROCESSO = [
  'Em recrutamento',
  'Seleção',
  'Entrevista',
  'Feedback',
];

export default function EtapasConfigPage() {
  const [config, setConfig] = useState<EtapasConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [openEtapa, setOpenEtapa] = useState<string | null>(ETAPAS_DO_PROCESSO[0]); // Deixa a primeira etapa aberta por padrão

  // A lógica de carregar e salvar permanece a mesma.
  useEffect(() => {
    async function loadConfig() {
      try {
        const response = await fetch('/api/configuracoes/etapas');
        if (!response.ok) throw new Error('Falha ao carregar configurações');
        const data = await response.json();
        if (data.config && typeof data.config.delayEntreEnvios === 'undefined') {
          data.config.delayEntreEnvios = 2000;
        }
        setConfig(data.config);
      } catch (error) {
        console.error(error);
        setSaveMessage({ text: 'Erro ao carregar configurações.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    }
    loadConfig();
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const response = await fetch('/api/configuracoes/etapas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Falha ao salvar');
      setSaveMessage({ text: 'Configurações salvas com sucesso!', type: 'success' });
    } catch (error) {
      console.error(error);
      setSaveMessage({ text: 'Erro ao salvar as configurações.', type: 'error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };
  
  const toggleDisparoGeral = () => {
    if (!config) return;
    setConfig({ ...config, disparoPorEtapaAtivado: !config.disparoPorEtapaAtivado });
  };

  // --- CORREÇÃO DO TYPESCRIPT APLICADA AQUI ---
  // Trocamos 'value: any' por 'value: string | boolean' para ser mais específico e seguro.
  const handleTemplateChange = (etapa: string, field: keyof TemplateEtapa, value: string | boolean) => {
    if (!config) return;
    setConfig(prevConfig => ({
      ...prevConfig!,
      templatesPorEtapa: {
        ...prevConfig!.templatesPorEtapa,
        [etapa]: {
          ...(prevConfig!.templatesPorEtapa[etapa] || { ativo: false, mensagem: '' }),
          [field]: value
        }
      }
    }));
  };

  const handleDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!config) return;
    const value = e.target.value;
    setConfig({ ...config, delayEntreEnvios: value === '' ? 0 : parseInt(value, 10) });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!config) {
    return <div className="p-8 text-center text-red-500">Não foi possível carregar as configurações.</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Cabeçalho */}
        <div className="mb-10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Workflow className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notificações por Etapa</h1>
              <p className="mt-1 text-gray-600">
                Configure mensagens e delays para cada avanço no processo seletivo.
              </p>
            </div>
          </div>
        </div>

        {/* Card de Controle Geral */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Controle Geral</h2>
              <p className="text-sm text-gray-500">Ativa ou desativa todas as notificações de etapa.</p>
            </div>
            <button onClick={toggleDisparoGeral}>
              {config.disparoPorEtapaAtivado ? (
                <ToggleRight className="h-12 w-12 text-green-500 transition-colors" />
              ) : (
                <ToggleLeft className="h-12 w-12 text-gray-400 transition-colors" />
              )}
            </button>
          </div>
          <div className="mt-6 border-t pt-6">
            <label htmlFor="delay" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Timer className="h-5 w-5" />
              Intervalo entre envios (em milissegundos)
            </label>
            <p className="mb-2 text-xs text-gray-500">Pausa ao vincular múltiplos candidatos. Recomendado: 2000ms.</p>
            <input
              type="number"
              id="delay"
              value={config.delayEntreEnvios || 0}
              onChange={handleDelayChange}
              className="w-full max-w-xs rounded-lg border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Ex: 2000"
            />
          </div>
        </div>

        {/* Seção de Templates com Acordeão */}
        <div className={`mt-8 transition-opacity duration-300 ${!config.disparoPorEtapaAtivado ? 'opacity-50' : ''}`}>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Templates de Mensagem</h2>
          <div className="space-y-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
            {ETAPAS_DO_PROCESSO.map(etapa => (
              <div key={etapa} className="overflow-hidden rounded-lg">
                {/* Cabeçalho do Acordeão (Botão de Título) */}
                <button
                  onClick={() => setOpenEtapa(openEtapa === etapa ? null : etapa)}
                  disabled={!config.disparoPorEtapaAtivado}
                  className="flex w-full items-center justify-between bg-gray-50 p-4 text-left transition-colors hover:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <div
                      onClick={(e) => { e.stopPropagation(); handleTemplateChange(etapa, 'ativo', !config.templatesPorEtapa[etapa]?.ativo); }}
                      className={`flex h-6 w-10 items-center rounded-full p-1 transition-colors ${config.templatesPorEtapa[etapa]?.ativo ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <div className={`h-4 w-4 rounded-full bg-white shadow-md transition-transform ${config.templatesPorEtapa[etapa]?.ativo ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                    <span className="font-semibold text-gray-800">{etapa}</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${openEtapa === etapa ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Conteúdo do Acordeão */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openEtapa === etapa ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="p-6">
                    <label htmlFor={`msg-${etapa}`} className="mb-2 block text-sm font-medium text-gray-700">
                      Mensagem para a etapa:
                    </label>
                    <textarea
                      id={`msg-${etapa}`}
                      value={config.templatesPorEtapa[etapa]?.mensagem || ''}
                      onChange={(e) => handleTemplateChange(etapa, 'mensagem', e.target.value)}
                      disabled={!config.disparoPorEtapaAtivado || !config.templatesPorEtapa[etapa]?.ativo}
                      placeholder={`Ex: Olá {nomeCandidato}, parabéns! Você avançou para a etapa de ${etapa}.`}
                      className="w-full text-gray-600 resize-none rounded-lg border-gray-300 p-3 font-mono text-sm shadow-inner focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
                      rows={5}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Barra de Ação Flutuante */}
        <div className="sticky bottom-0 mt-8 rounded-t-2xl border-t border-gray-200 bg-white/80 p-4 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-end">
            {saveMessage && (
              <div className={`mr-4 flex items-center gap-2 text-sm font-medium ${saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {saveMessage.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                {saveMessage.text}
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex min-w-[150px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isSaving ? <><Loader2 className="h-5 w-5 animate-spin" /> Salvando...</> : <><Save className="h-5 w-5" /> Salvar Alterações</>}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}