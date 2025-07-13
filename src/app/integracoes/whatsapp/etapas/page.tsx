// src/app/integracoes/whatsapp/etapas/page.tsx

'use client';

import { useState, useEffect } from 'react';
import type { EtapasConfig, TemplateEtapa } from '@/types/configuracoes';
import { Loader2, CheckCircle, Save, ToggleLeft, ToggleRight, AlertTriangle, Timer } from 'lucide-react';

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

  useEffect(() => {
    async function loadConfig() {
      try {
        const response = await fetch('/api/configuracoes/etapas');
        if (!response.ok) throw new Error('Falha ao carregar configurações');
        const data = await response.json();
        
        // --- AJUSTE DE LÓGICA AQUI ---
        // Garante que o delay tenha um valor padrão se não vier da API, evitando erros.
        if (data.config && typeof data.config.delayEntreEnvios === 'undefined') {
          data.config.delayEntreEnvios = 2000; // Padrão de 2 segundos
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

  const handleTemplateChange = (etapa: string, field: keyof TemplateEtapa, value: any) => {
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
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800">Notificações por Etapa do Processo</h1>
        <p className="mt-2 text-gray-600">
          Configure mensagens automáticas via WhatsApp para cada mudança de etapa dos candidatos.
        </p>
        
        {/* Card do Interruptor Geral */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Disparo por Etapa</h2>
              <p className="text-sm text-gray-500">Ativa ou desativa TODAS as notificações de mudança de etapa.</p>
            </div>
            <button onClick={toggleDisparoGeral}>
              {config.disparoPorEtapaAtivado ? (
                <ToggleRight className="h-12 w-12 text-green-600" />
              ) : (
                <ToggleLeft className="h-12 w-12 text-gray-400" />
              )}
            </button>
          </div>
          
          {/* --- AJUSTE DE LAYOUT AQUI --- */}
          {/* O campo de delay foi movido para DENTRO deste card. */}
          <div className="mt-6 border-t pt-4">
            <label htmlFor="delay" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Timer className="h-5 w-5" />
              Intervalo entre envios (em milissegundos)
            </label>
            <p className="mb-2 text-xs text-gray-500">Aguardar um tempo entre cada mensagem ao vincular múltiplos candidatos. (Ex: 2000 = 2 segundos). Recomendado: acima de 1500.</p>
            <input
              type="number"
              id="delay"
              value={config.delayEntreEnvios || 0} // Adicionado '|| 0' para segurança
              onChange={handleDelayChange}
              className="w-full max-w-xs rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ex: 2000"
            />
          </div>
        </div> {/* <-- A div do card agora fecha aqui, corretamente. */}


        {/* Templates para cada Etapa */}
        <div className={`mt-6 space-y-4 transition-opacity ${!config.disparoPorEtapaAtivado ? 'opacity-50' : ''}`}>
          <h2 className="text-2xl font-semibold text-gray-700">Templates de Mensagem</h2>
          {ETAPAS_DO_PROCESSO.map(etapa => (
            <div key={etapa} className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b bg-gray-50 p-4">
                <h3 className="font-semibold text-gray-800">{etapa}</h3>
                <button 
                  onClick={() => handleTemplateChange(etapa, 'ativo', !config.templatesPorEtapa[etapa]?.ativo)}
                  disabled={!config.disparoPorEtapaAtivado}
                  className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
                >
                  {config.templatesPorEtapa[etapa]?.ativo ? (
                     <><CheckCircle className="h-4 w-4 text-green-500" /> Ativo</>
                  ) : (
                     <><AlertTriangle className="h-4 w-4 text-gray-400" /> Inativo</>
                  )}
                </button>
              </div>
              <div className="p-4">
                <label htmlFor={`msg-${etapa}`} className="mb-2 block text-sm font-medium text-gray-700">
                  Mensagem para a etapa:
                </label>
                <textarea
                  id={`msg-${etapa}`}
                  value={config.templatesPorEtapa[etapa]?.mensagem || ''}
                  onChange={(e) => handleTemplateChange(etapa, 'mensagem', e.target.value)}
                  disabled={!config.disparoPorEtapaAtivado || !config.templatesPorEtapa[etapa]?.ativo}
                  placeholder={`Ex: Olá {nomeCandidato}, parabéns! Você avançou para a etapa de ${etapa}.`}
                  className="w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Botão de Salvar Fixo */}
        <div className="sticky bottom-0 mt-8 rounded-t-lg border-t bg-white/80 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-end gap-4">
            {saveMessage && (
              <div className={`flex items-center gap-2 text-sm font-semibold ${saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {saveMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                {saveMessage.text}
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex w-40 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Salvando...
                </>
              ) : (
                <>
                  <Save size={20} /> Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}