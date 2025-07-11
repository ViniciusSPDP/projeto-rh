// app/components/ModalNotificacaoWhatsApp.tsx

'use client'

import { useState } from 'react'
import { X, MessageCircle, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface Candidato {
  id: string | number
  nome: string
  telefone: string
  etapa: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  vagaId: number
  vagaTitulo: string
  candidatos: Candidato[]
}

export default function ModalNotificacaoWhatsApp({
  isOpen,
  onClose,
  vagaId,
  vagaTitulo,
  candidatos
}: Props) {
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState<any>(null)
  const [candidatosSelecionados, setCandidatosSelecionados] = useState<string[]>([])

  if (!isOpen) return null

  const contratados = candidatos.filter(c => c.etapa === 'Contratado')
  const reprovados = candidatos.filter(c => c.etapa !== 'Contratado')

  const handleEnviar = async (tipo: 'TODOS' | 'CONTRATADOS' | 'REPROVADOS') => {
    setEnviando(true)
    setResultado(null)

    try {
      let candidatosParaEnviar: string[] = []

      switch (tipo) {
        case 'TODOS':
          candidatosParaEnviar = candidatos.map(c => String(c.id))
          break
        case 'CONTRATADOS':
          candidatosParaEnviar = contratados.map(c => String(c.id))
          break
        case 'REPROVADOS':
          candidatosParaEnviar = reprovados.map(c => String(c.id))
          break
      }

      const response = await fetch('/api/integracoes/whatsapp/notificar-candidatos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vagaId,
          candidatoIds: candidatosParaEnviar,
          tipo: tipo === 'CONTRATADOS' ? 'CONTRATADO' : 'REPROVADO'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar mensagens')
      }

      setResultado(data)
    } catch (error) {
      setResultado({
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Notificar Candidatos via WhatsApp</h2>
              <p className="text-sm text-gray-600">Vaga: {vagaTitulo}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Resumo */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-green-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-700">Contratados</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <p className="mt-1 text-2xl font-semibold text-green-900">
                  {contratados.length}
                </p>
              </div>
              
              <div className="rounded-lg bg-red-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-700">Reprovados</span>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <p className="mt-1 text-2xl font-semibold text-red-900">
                  {reprovados.length}
                </p>
              </div>
            </div>

            {/* Ações */}
            <div className="space-y-3">
              <h3 className="font-medium">Enviar notificações para:</h3>
              
              <button
                onClick={() => handleEnviar('TODOS')}
                disabled={enviando || candidatos.length === 0}
                className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium">Todos os candidatos</p>
                    <p className="text-sm text-gray-600">
                      Enviar mensagem personalizada para cada grupo
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{candidatos.length} mensagens</span>
              </button>

              <button
                onClick={() => handleEnviar('CONTRATADOS')}
                disabled={enviando || contratados.length === 0}
                className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-green-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium">Apenas contratados</p>
                    <p className="text-sm text-gray-600">
                      Mensagem de boas-vindas
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{contratados.length} mensagens</span>
              </button>

              <button
                onClick={() => handleEnviar('REPROVADOS')}
                disabled={enviando || reprovados.length === 0}
                className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-red-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div className="text-left">
                    <p className="font-medium">Apenas reprovados</p>
                    <p className="text-sm text-gray-600">
                      Mensagem de agradecimento
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{reprovados.length} mensagens</span>
              </button>
            </div>

            {/* Loading */}
            {enviando && (
              <div className="flex items-center justify-center gap-2 rounded-lg bg-blue-50 p-4">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <span className="text-blue-700">Enviando mensagens...</span>
              </div>
            )}

            {/* Resultado */}
            {resultado && (
              <div className={`rounded-lg p-4 ${resultado.erro ? 'bg-red-50' : 'bg-green-50'}`}>
                {resultado.erro ? (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-800">Erro ao enviar mensagens</p>
                      <p className="text-sm text-red-600">{resultado.erro}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="font-medium text-green-800">Mensagens enviadas!</p>
                    </div>
                    <div className="space-y-1 text-sm text-green-700">
                      <p>✓ Enviadas com sucesso: {resultado.resultado?.sucesso || 0}</p>
                      {resultado.resultado?.falha > 0 && (
                        <p>✗ Falhas no envio: {resultado.resultado.falha}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}