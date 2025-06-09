'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ShieldX, LoaderCircle, AlertTriangle } from 'lucide-react'

export function BotaoFecharVaga({ vagaId }: { vagaId: number }) {
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleConfirmarEncerramento = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/vagas/${vagaId}/fechar`, {
        method: 'PATCH',
      })

      if (res.ok) {
        toast.success('Vaga encerrada com sucesso!')
        // Fecha o modal antes de recarregar os dados para a transição de saída ser visível
        setIsModalOpen(false)
        router.refresh()
      } else {
        const data = await res.json().catch(() => null)
        toast.error(data?.error || 'Não foi possível encerrar a vaga.')
      }
    } catch (error) {
      toast.error('Ocorreu um erro de comunicação com o servidor.')
    } finally {
      // O loading já é suficiente aqui, o modal será fechado no sucesso
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-50"
      >
        <ShieldX size={16} />
        <span>Encerrar Vaga</span>
      </button>

      {/* --- Modal de Confirmação --- */}
      {isModalOpen && (
        <div
          // 1. Fundo com blur e animação de FADE-IN
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            // 2. Caixa do modal com animação de SCALE-IN
            className="mx-4 w-full max-w-md transform rounded-xl bg-white p-6 text-left align-middle shadow-xl animate-scale-in"
          >
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0">
                <AlertTriangle
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>

              <div className="mt-3 sm:ml-4 sm:mt-0">
                <h3
                  className="text-lg font-semibold leading-6 text-gray-900"
                  id="modal-title"
                >
                  Encerrar Vaga
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Você tem certeza que deseja encerrar esta vaga? Esta ação
                    é{' '}
                    <span className="font-bold text-red-600">
                      irreversível
                    </span>{' '}
                    e impedirá que novos candidatos se inscrevam.
                  </p>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="mt-6 sm:flex sm:flex-row-reverse sm:gap-3">
              <button
                type="button"
                onClick={handleConfirmarEncerramento}
                disabled={loading}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Encerrando...
                  </>
                ) : (
                  'Sim, encerrar vaga'
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={loading}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50 disabled:opacity-50 sm:mt-0 sm:w-auto"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}