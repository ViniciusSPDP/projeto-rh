// app/configuracoes/templates-whatsapp/TemplatesWhatsApp.tsx

'use client'

import { useState, useEffect } from 'react'
import { Save, Clock, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import VariaveisDisponiveis from './VariaveisDisponiveis'

interface Template {
  tipo: 'CONTRATADO' | 'REPROVADO'
  titulo: string
  mensagem: string
}

interface ConfigWhatsApp {
  templates: {
    CONTRATADO: Template
    REPROVADO: Template
  }
  delayEntreEnvios: number
}

const defaultConfig: ConfigWhatsApp = {
  templates: {
    CONTRATADO: {
      tipo: 'CONTRATADO',
      titulo: 'Mensagem para Candidatos Contratados',
      mensagem: `🎉 Parabéns, {{nomeCandidato}}!

Temos o prazer de informar que você foi APROVADO(A) no processo seletivo para a vaga de {{titulo}}.

Entraremos em contato em breve com os próximos passos.

Atenciosamente,
Equipe de RH`
    },
    REPROVADO: {
      tipo: 'REPROVADO',
      titulo: 'Mensagem para Candidatos Não Selecionados',
      mensagem: `Olá {{nomeCandidato}},

Agradecemos sua participação no processo seletivo para a vaga de {{titulo}}.

Após cuidadosa análise, decidimos seguir com outros candidatos. Manteremos seu currículo em nosso banco de talentos.

Desejamos sucesso em sua jornada!

Atenciosamente,
Equipe de RH`
    }
  },
  delayEntreEnvios: 2000
}

export default function TemplatesWhatsApp() {
  const [config, setConfig] = useState<ConfigWhatsApp>(defaultConfig)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<'CONTRATADO' | 'REPROVADO'>('CONTRATADO')

  // Carregar configurações salvas
  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/configuracoes/whatsapp')
      if (response.ok) {
        const data = await response.json()
        if (data.config) {
          setConfig(data.config)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveConfig = async () => {
    setIsSaving(true)
    setSavedMessage('')

    try {
      const response = await fetch('/api/configuracoes/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })

      if (response.ok) {
        setSavedMessage('Configurações salvas com sucesso!')
        setTimeout(() => setSavedMessage(''), 3000)
      } else {
        throw new Error('Erro ao salvar configurações')
      }
    } catch (error) {
      setSavedMessage('Erro ao salvar configurações')
      console.error('Erro:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const updateTemplate = (tipo: 'CONTRATADO' | 'REPROVADO', mensagem: string) => {
    setConfig(prev => ({
      ...prev,
      templates: {
        ...prev.templates,
        [tipo]: {
          ...prev.templates[tipo],
          mensagem
        }
      }
    }))
  }

  const updateDelay = (delay: number) => {
    setConfig(prev => ({
      ...prev,
      delayEntreEnvios: delay
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tabs de Templates */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setSelectedTemplate('CONTRATADO')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                selectedTemplate === 'CONTRATADO'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Candidatos Contratados
              </div>
            </button>
            <button
              onClick={() => setSelectedTemplate('REPROVADO')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                selectedTemplate === 'REPROVADO'
                  ? 'border-b-2 border-red-500 text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Candidatos Não Selecionados
              </div>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Editor de Template */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem
              </label>
              <textarea
                value={config.templates[selectedTemplate].mensagem}
                onChange={(e) => updateTemplate(selectedTemplate, e.target.value)}
                rows={12}
                className="w-full text-gray-600 rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Digite a mensagem..."
              />
              <p className="mt-2 text-xs text-gray-500">
                Use as variáveis disponíveis entre chaves duplas, ex: {'{{nomeCandidato}}'}
              </p>
            </div>

            {/* Preview */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="mb-2 text-sm font-medium text-gray-700">Preview da mensagem:</h4>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {config.templates[selectedTemplate].mensagem
                    .replace(/{{nomeCandidato}}/g, 'João Silva')
                    .replace(/{{titulo}}/g, 'Analista de RH')
                    .replace(/{{cpfCandidato}}/g, '123.456.789-00')
                    .replace(/{{emailCandidato}}/g, 'joao.silva@email.com')
                    .replace(/{{telefoneCandidato}}/g, '(11) 98765-4321')
                    .replace(/{{etapa}}/g, 'Entrevista')
                    .replace(/{{status}}/g, 'Aberta')
                  }
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configuração de Delay */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-600" />
          Configuração de Envio
        </h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="delay" className="block text-sm font-medium text-gray-700 mb-2">
              Delay entre mensagens (em milissegundos)
            </label>
            <div className="flex items-center gap-4">
              <input
                id="delay"
                type="number"
                min="1000"
                max="10000"
                step="500"
                value={config.delayEntreEnvios}
                onChange={(e) => updateDelay(Number(e.target.value))}
                className="w-32 text-gray-700 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="text-sm text-gray-600">
                ({(config.delayEntreEnvios / 1000).toFixed(1)} segundos)
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Recomendado: 2000ms (2 segundos) para evitar bloqueios
            </p>
          </div>
        </div>
      </div>

      {/* Variáveis Disponíveis */}
      <VariaveisDisponiveis />

      {/* Botões de Ação */}
      <div className="flex items-center justify-between">
        <div>
          {savedMessage && (
            <div className={`flex items-center gap-2 text-sm ${
              savedMessage.includes('sucesso') ? 'text-green-600' : 'text-red-600'
            }`}>
              {savedMessage.includes('sucesso') ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {savedMessage}
            </div>
          )}
        </div>
        
        <button
          onClick={saveConfig}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Salvar Configurações
            </>
          )}
        </button>
      </div>
    </div>
  )
}