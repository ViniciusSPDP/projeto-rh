// app/integracoes/whatsapp/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  ToggleLeft, 
  ToggleRight, 
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  ZapOff,      // Novo ícone
  Workflow,    // Novo ícone
} from 'lucide-react';

// Interfaces para as duas configurações
interface DisparoFimVagaConfig {
  disparoAutomatico: boolean;
  // outras propriedades...
}
interface DisparoEtapasConfig {
  disparoPorEtapaAtivado: boolean;
  // outras propriedades...
}

export default function WhatsAppConfigPage() {
  // Estados separados para cada configuração
  const [fimVagaConfig, setFimVagaConfig] = useState<DisparoFimVagaConfig | null>(null);
  const [etapasConfig, setEtapasConfig] = useState<DisparoEtapasConfig | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<'fimVaga' | 'etapas' | null>(null);
  const [,setMessage] = useState('');

  // Carrega AMBAS as configurações em paralelo
  useEffect(() => {
    async function loadAllConfigs() {
      try {
        const [fimVagaResponse, etapasResponse] = await Promise.all([
          fetch('/api/configuracoes/whatsapp'),
          fetch('/api/configuracoes/etapas')
        ]);

        if (!fimVagaResponse.ok || !etapasResponse.ok) {
          throw new Error('Falha ao carregar uma das configurações');
        }

        const fimVagaData = await fimVagaResponse.json();
        const etapasData = await etapasResponse.json();

        setFimVagaConfig(fimVagaData.config || { disparoAutomatico: false });
        setEtapasConfig(etapasData.config || { disparoPorEtapaAtivado: false });

      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        setMessage('Erro ao carregar os dados. Tente recarregar a página.');
      } finally {
        setIsLoading(false);
      }
    }
    loadAllConfigs();
  }, []);

  // Função para o toggle de FIM DE VAGA
  const toggleFimVaga = async () => {
    if (!fimVagaConfig) return;
    setIsSaving('fimVaga');
    const novoStatus = !fimVagaConfig.disparoAutomatico;
    const novaConfig = { ...fimVagaConfig, disparoAutomatico: novoStatus };
    
    try {
      const response = await fetch('/api/configuracoes/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaConfig)
      });
      if (response.ok) setFimVagaConfig(novaConfig);
      else throw new Error('Falha ao salvar');
    } catch (error) {
      console.error('Erro ao salvar config de fim de vaga:', error);
      // Reverte em caso de erro
      setFimVagaConfig({ ...fimVagaConfig, disparoAutomatico: !novoStatus });
    } finally {
      setIsSaving(null);
    }
  };

  // Função para o toggle de MUDANÇA DE ETAPA
  const toggleEtapas = async () => {
    if (!etapasConfig) return;
    setIsSaving('etapas');
    const novoStatus = !etapasConfig.disparoPorEtapaAtivado;
    const novaConfig = { ...etapasConfig, disparoPorEtapaAtivado: novoStatus };
    
    try {
      const response = await fetch('/api/configuracoes/etapas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaConfig)
      });
      if (response.ok) setEtapasConfig(novaConfig);
       else throw new Error('Falha ao salvar');
    } catch (error) {
      console.error('Erro ao salvar config de etapas:', error);
      // Reverte em caso de erro
      setEtapasConfig({ ...etapasConfig, disparoPorEtapaAtivado: !novoStatus });
    } finally {
      setIsSaving(null);
    }
  };


  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl p-6 md:p-8">
        {/* Cabeçalho */}
        <div className="mb-10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <MessageSquare className="h-7 w-7 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Automações do WhatsApp</h1>
              <p className="mt-1 text-gray-600">
                Ative, desative e gerencie os disparos automáticos de mensagens.
              </p>
            </div>
          </div>
        </div>

        {/* Seção de Automações */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">Automações de Disparo</h2>

          {/* Card 1: Notificações de Fim de Vaga */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <ZapOff className="mt-1 h-6 w-6 text-gray-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Mensagem de Fim de Vaga</h3>
                    <p className="mt-1 text-sm text-gray-600">Envia mensagens para aprovados e reprovados ao encerrar uma vaga.</p>
                  </div>
                </div>
                <button onClick={toggleFimVaga} disabled={isSaving === 'fimVaga'} className="flex-shrink-0">
                  {isSaving === 'fimVaga' ? <Loader2 className="h-10 w-10 animate-spin text-gray-400"/> : (fimVagaConfig?.disparoAutomatico ? <ToggleRight className="h-10 w-10 text-green-500"/> : <ToggleLeft className="h-10 w-10 text-gray-400"/>)}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-b-xl border-t bg-gray-50 px-6 py-3">
              <div className="flex items-center gap-2 text-sm">
                {fimVagaConfig?.disparoAutomatico ? <><CheckCircle className="h-5 w-5 text-green-500"/><span className="font-medium text-green-700">Ativado</span></> : <><AlertCircle className="h-5 w-5 text-gray-400"/><span className="font-medium text-gray-500">Desativado</span></>}
              </div>
              <Link href="/integracoes/whatsapp/templates-whatsapp" className="group flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-100">
                Configurar Templates <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Notificações por Etapa */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <Workflow className="mt-1 h-6 w-6 text-gray-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Mensagem por Etapa</h3>
                    <p className="mt-1 text-sm text-gray-600">Envia uma mensagem ao candidato sempre que ele avança no processo seletivo.</p>
                  </div>
                </div>
                <button onClick={toggleEtapas} disabled={isSaving === 'etapas'} className="flex-shrink-0">
                  {isSaving === 'etapas' ? <Loader2 className="h-10 w-10 animate-spin text-gray-400"/> : (etapasConfig?.disparoPorEtapaAtivado ? <ToggleRight className="h-10 w-10 text-green-500"/> : <ToggleLeft className="h-10 w-10 text-gray-400"/>)}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-b-xl border-t bg-gray-50 px-6 py-3">
              <div className="flex items-center gap-2 text-sm">
                 {etapasConfig?.disparoPorEtapaAtivado ? <><CheckCircle className="h-5 w-5 text-green-500"/><span className="font-medium text-green-700">Ativado</span></> : <><AlertCircle className="h-5 w-5 text-gray-400"/><span className="font-medium text-gray-500">Desativado</span></>}
              </div>
              <Link href="/integracoes/whatsapp/etapas" className="group flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-100">
                Gerenciar Etapas e Delay <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
          
        </div>

      </div>
    </main>
  );
}