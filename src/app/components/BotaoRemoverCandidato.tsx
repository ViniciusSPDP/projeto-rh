'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Trash2, LoaderCircle, AlertTriangle } from 'lucide-react'

interface Props {
  vagaId: number
  vagaCandidatoId: number
}

export default function BotaoRemoverCandidato({ vagaId, vagaCandidatoId }: Props) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const remover = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/vagas/${vagaId}/candidato/${vagaCandidatoId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success('Candidato removido da vaga')
        setOpen(false)
        router.refresh()
      } else {
        const data = await res.json().catch(() => null)
        toast.error(data?.error || 'Erro ao remover candidato')
      }
    } catch (_e) {
      console.error(_e)
      toast.error('Erro de comunicação com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1 text-red-600 hover:bg-red-100 rounded"
        title="Remover candidato da vaga"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 text-center shadow-xl">
            <div className="mb-4 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Remover Candidato</h3>
            <p className="mt-2 text-sm text-gray-600">Tem certeza que deseja remover este candidato da vaga?</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={remover}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : 'Remover'}
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