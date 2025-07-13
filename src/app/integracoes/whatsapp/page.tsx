// app/integracoes/whatsapp/page.tsx

'use client'

import { useState, useEffect } from 'react'
//import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  MessageSquare, 
  Settings, 
  ToggleLeft, 
  ToggleRight, 
  FileText,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface WhatsAppConfig {
  disparoAutomatico: boolean
  templates: {
    CONTRATADO: { mensagem: string }
    REPROVADO: { mensagem: string }
  }
  delayEntreEnvios: number
}

export default function WhatsAppConfigPage() {
  //const router = useRouter()
  const [config, setConfig] = useState<WhatsAppConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/configuracoes/whatsapp')
      if (response.ok) {
        const data = await response.json()
        setConfig(data.config || {
          disparoAutomatico: false,
          templates: {
            CONTRATADO: { mensagem: '' },
            REPROVADO: { mensagem: '' }
          },
          delayEntreEnvios: 2000
        })
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleDisparoAutomatico = async () => {
    if (!config) return

    setIsSaving(true)
    setMessage('')

    try {
      const novoStatus = !config.disparoAutomatico
      const novaConfig = { ...config, disparoAutomatico: novoStatus }

      const response = await fetch('/api/configuracoes/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaConfig)
      })

      if (response.ok) {
        setConfig(novaConfig)
        setMessage(novoStatus ? 'Disparo automático ativado!' : 'Disparo automático desativado!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        throw new Error('Erro ao salvar configuração')
      }
    } catch (error) {
      setMessage('Erro ao salvar configuração')
      console.error('Erro:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-6">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-green-100 p-2">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Configurações do WhatsApp</h1>
          </div>
          <p className="text-gray-600">
            Gerencie as configurações de integração com o WhatsApp
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Card de Disparo Automático */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Disparo Automático
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Enviar mensagens automaticamente ao encerrar vagas
                </p>
              </div>
              <button
                onClick={toggleDisparoAutomatico}
                disabled={isSaving}
                className="relative"
              >
                {config?.disparoAutomatico ? (
                  <ToggleRight className={`h-12 w-12 ${isSaving ? 'text-gray-400' : 'text-green-600'} transition-colors`} />
                ) : (
                  <ToggleLeft className={`h-12 w-12 ${isSaving ? 'text-gray-400' : 'text-gray-400'} transition-colors`} />
                )}
              </button>
            </div>

            <div className={`rounded-lg p-4 ${config?.disparoAutomatico ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-2">
                {config?.disparoAutomatico ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Ativado</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Desativado</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {config?.disparoAutomatico 
                  ? 'Mensagens serão enviadas automaticamente quando uma vaga for encerrada'
                  : 'Nenhuma mensagem será enviada ao encerrar vagas'
                }
              </p>
            </div>

            {message && (
              <div className={`mt-4 p-3 rounded-lg ${
                message.includes('Erro') ? 'bg-red-50' : 'bg-green-50'
              }`}>
                <p className={`text-sm ${
                  message.includes('Erro') ? 'text-red-700' : 'text-green-700'
                }`}>
                  {message}
                </p>
              </div>
            )}
          </div>

          {/* Card de Templates */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Templates de Mensagem
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Configure as mensagens enviadas aos candidatos
              </p>
            </div>

            <Link
              href="/integracoes/whatsapp/templates-whatsapp"
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2 group-hover:bg-blue-200 transition-colors">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Gerenciar Templates</p>
                  <p className="text-sm text-gray-600">
                    Personalize as mensagens para cada situação
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
            </Link>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-gray-600">Template para candidatos aprovados</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span className="text-gray-600">Template para candidatos reprovados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Como funciona?</h3>
              <ul className="mt-2 space-y-1 text-sm text-blue-800">
                <li>• Quando ativado, mensagens são enviadas automaticamente ao encerrar uma vaga</li>
                <li>• Candidatos aprovados recebem mensagem de congratulações</li>
                <li>• Candidatos não selecionados recebem mensagem de agradecimento</li>
                <li>• Apenas candidatos com telefone cadastrado recebem as mensagens</li>
                <li>• As mensagens são enviadas via WhatsApp conectado na aba Integrações</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}