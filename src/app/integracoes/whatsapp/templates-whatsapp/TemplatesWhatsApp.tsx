// app/configuracoes/templates-whatsapp/TemplatesWhatsApp.tsx

'use client'

import { useState, useEffect } from 'react'
import { Save, AlertCircle, CheckCircle, Loader2, MessageSquareText, SlidersHorizontal, Eye } from 'lucide-react'
import VariaveisDisponiveis from './VariaveisDisponiveis'

// --- Interfaces e dados padrão não precisam de grandes mudanças ---
interface Template {
  tipo: 'CONTRATADO' | 'REPROVADO'
  titulo: string
  mensagem: string
}
interface ConfigWhatsApp {
  templates: { CONTRATADO: Template; REPROVADO: Template };
  delayEntreEnvios: number;
}
const defaultConfig: ConfigWhatsApp = {
  templates: {
    CONTRATADO: { tipo: 'CONTRATADO', titulo: 'Mensagem para Candidatos Contratados', mensagem: `🎉 Parabéns, {{nomeCandidato}}!\n\nTemos o prazer de informar que você foi APROVADO(A) no processo seletivo para a vaga de {{titulo}}.\n\nEntraremos em contato em breve com os próximos passos.\n\nAtenciosamente,\nEquipe de RH` },
    REPROVADO: { tipo: 'REPROVADO', titulo: 'Mensagem para Candidatos Não Selecionados', mensagem: `Olá {{nomeCandidato}},\n\nAgradecemos sua participação no processo seletivo para a vaga de {{titulo}}.\n\nApós cuidadosa análise, decidimos seguir com outros candidatos. Manteremos seu currículo em nosso banco de talentos.\n\nDesejamos sucesso em sua jornada!\n\nAtenciosamente,\nEquipe de RH` }
  },
  delayEntreEnvios: 2000
};

export default function TemplatesWhatsApp() {
  const [config, setConfig] = useState<ConfigWhatsApp>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<'CONTRATADO' | 'REPROVADO'>('CONTRATADO');

  // As funções de lógica (load, save, update) podem permanecer as mesmas
  useEffect(() => { loadConfig() }, []);
  const loadConfig = async () => { /* ... sua lógica ... */
    try {
      const response = await fetch('/api/configuracoes/whatsapp');
      if (response.ok) {
        const data = await response.json();
        if (data.config) setConfig(data.config);
      }
    } catch (error) { console.error('Erro ao carregar configurações:', error) }
    finally { setIsLoading(false) }
  };
  const saveConfig = async () => { /* ... sua lógica ... */
    setIsSaving(true);
    setSavedMessage('');
    try {
      const response = await fetch('/api/configuracoes/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (response.ok) {
        setSavedMessage('Configurações salvas com sucesso!');
        setTimeout(() => setSavedMessage(''), 4000);
      } else { throw new Error('Erro ao salvar configurações') }
    } catch (error) {
      setSavedMessage('Erro ao salvar configurações');
      console.error('Erro:', error);
    } finally { setIsSaving(false) }
  };
  const updateTemplate = (tipo: 'CONTRATADO' | 'REPROVADO', mensagem: string) => { setConfig(prev => ({ ...prev, templates: { ...prev.templates, [tipo]: { ...prev.templates[tipo], mensagem } } })) };
  const updateDelay = (delay: number) => { setConfig(prev => ({ ...prev, delayEntreEnvios: delay })) };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const currentTemplate = config.templates[selectedTemplate];

  return (
    <div className="relative min-h-[calc(100vh-200px)]">
      {/* Container Principal com Layout de 2 Colunas */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* --- Coluna da Esquerda (Editor) --- */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                <MessageSquareText className="h-6 w-6 text-blue-600" />
                Editor de Templates
              </h2>
              <p className="mt-1 text-sm text-gray-600">Selecione o template e edite a mensagem que será enviada.</p>

              {/* Seletor de Templates (Novo Design) */}
              <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
                <button onClick={() => setSelectedTemplate('CONTRATADO')} className={`flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold transition-all ${selectedTemplate === 'CONTRATADO' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>
                  <CheckCircle className="h-5 w-5" /> Contratado
                </button>
                <button onClick={() => setSelectedTemplate('REPROVADO')} className={`flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold transition-all ${selectedTemplate === 'REPROVADO' ? 'bg-white text-red-700 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}>
                  <AlertCircle className="h-5 w-5" /> Reprovado
                </button>
              </div>

              {/* Textarea */}
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-800">{currentTemplate.titulo}</label>
                <textarea
                  value={currentTemplate.mensagem}
                  onChange={(e) => updateTemplate(selectedTemplate, e.target.value)}
                  rows={15}
                  className="mt-2 w-full resize-none rounded-lg border border-gray-300 p-4 font-mono text-sm leading-relaxed text-gray-800 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Digite sua mensagem aqui..."
                />
              </div>
            </div>
          </div>

          {/* Configurações Adicionais (Delay) */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-3 text-lg font-semibold text-gray-900">
              <SlidersHorizontal className="h-6 w-6 text-blue-600" />
              Configurações de Envio
            </h3>
            <div className="mt-4">
              <label htmlFor="delay" className="block text-sm font-medium text-gray-700">Delay entre mensagens</label>
              <p className="mt-1 text-xs text-gray-500">Intervalo em milissegundos para envios em lote. Recomendado: 2000ms.</p>
              <div className="mt-2 flex items-center gap-4">
                <input id="delay" type="number" min="1000" max="10000" step="500" value={config.delayEntreEnvios} onChange={(e) => updateDelay(Number(e.target.value))} className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                <span className="text-sm text-gray-600">({(config.delayEntreEnvios / 1000).toFixed(1)}s)</span>
              </div>
            </div>
          </div>

          <div>
            <VariaveisDisponiveis />
          </div>
        </div>

        {/* --- Coluna da Direita (Preview e Variáveis) - CORRIGIDA PARA FICAR FIXA --- */}
        <div className="lg:sticky lg:top-20 lg:self-start lg:h-fit lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto">
          {/* Preview Realista */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <h3 className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                <Eye className="h-6 w-6 text-blue-600" />
                Preview em Tempo Real
              </h3>
              <div className="mt-4 rounded-xl bg-slate-100 p-4">
                <div className="mx-auto max-w-sm space-y-2">
                  <p className="text-center text-xs text-gray-500">Hoje</p>
                  <div className="w-fit max-w-[85%] rounded-xl rounded-bl-md bg-green-100 p-3 shadow-sm">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                      {currentTemplate.mensagem
                        .replace(/{{nomeCandidato}}/g, 'João Silva')
                        .replace(/{{titulo}}/g, 'Analista de RH')
                        .replace(/{{cpfCandidato}}/g, '123.456.789-00')
                        .replace(/{{emailCandidato}}/g, 'joao.silva@email.com')
                        .replace(/{{telefoneCandidato}}/g, '(11) 98765-4321')
                        .replace(/{{etapa}}/g, 'Entrevista')
                        .replace(/{{status}}/g, 'Aberta')}
                    </pre>
                    <p className="mt-1 text-right text-xs text-green-800/70">11:15</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* --- Barra de Ação Flutuante --- */}
      <div className="sticky bottom-0 mt-8 rounded-t-2xl border-t border-gray-200 bg-white/80 p-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-end">
          {savedMessage && (
            <div className={`mr-4 flex items-center gap-2 text-sm font-medium ${savedMessage.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
              {savedMessage.includes('sucesso') ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              {savedMessage}
            </div>
          )}
          <button
            onClick={saveConfig}
            disabled={isSaving}
            className="flex min-w-[150px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isSaving ? <><Loader2 className="h-5 w-5 animate-spin" /> Salvando...</> : <><Save className="h-5 w-5" /> Salvar Alterações</>}
          </button>
        </div>
      </div>
    </div>
  )
}