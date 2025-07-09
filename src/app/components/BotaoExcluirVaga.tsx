'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Trash2, LoaderCircle, AlertTriangle } from 'lucide-react'

interface BotaoExcluirVagaProps {
  vagaId: number
}

export function BotaoExcluirVaga({ vagaId }: BotaoExcluirVagaProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const excluir = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/vagas/${vagaId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Vaga excluída com sucesso!')
        setOpen(false)
        router.push('/vagas')
        router.refresh()
      } else {
        const data = await res.json().catch(() => null)
        toast.error(data?.error || 'Não foi possível excluir a vaga.')
      }
    } catch (_error) {
      console.error(_error)
      toast.error('Ocorreu um erro de comunicação com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
      >
        <Trash2 size={16} />
        <span>Excluir Vaga</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 text-center shadow-xl">
            <div className="mb-4 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Excluir Vaga</h3>
            <p className="mt-2 text-sm text-gray-600">
              Tem certeza que deseja excluir esta vaga? Esta ação é irreversível.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={excluir}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  'Excluir'
                )}
              </button>
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-colors hover:bg-gray-50 disabled:opacity-50"
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