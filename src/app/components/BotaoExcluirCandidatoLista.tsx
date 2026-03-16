'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Trash2, LoaderCircle, AlertTriangle } from 'lucide-react'

interface Props {
  candidatoId: string | number
  nomeCandidato: string
}

export default function BotaoExcluirCandidatoLista({ candidatoId, nomeCandidato }: Props) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleExcluir = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/candidatos/${candidatoId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success('Candidato excluído com sucesso')
        setOpen(false)
        router.refresh()
      } else {
        const data = await res.json().catch(() => null)
        toast.error(data?.error || 'Erro ao excluir candidato')
      }
    } catch (error) {
      console.error(error)
      toast.error('Erro de comunicação com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
        title="Excluir candidato"
      >
        <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Excluir</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => !loading && setOpen(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all border border-red-100">
            {/* Header decorativo */}
            <div className="bg-red-50 px-6 py-6 text-center border-b border-red-100">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4 shadow-sm border border-red-200">
                <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Excluir Candidato
              </h3>
            </div>
            
            {/* Corpo principal */}
            <div className="px-6 py-5 text-center">
              <p className="text-gray-600 text-base">
                Tem certeza que deseja excluir o(a) candidato(a) <span className="font-bold text-gray-800">{nomeCandidato}</span> do sistema? 
              </p>
              <p className="mt-3 text-sm font-medium text-red-600 bg-red-50 py-2 px-3 rounded-lg border border-red-100">
                Esta ação apagará também o histórico e vínculos com vagas e não poderá ser desfeita.
              </p>
            </div>

            {/* Ações */}
            <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end border-t border-gray-100">
              <button
                type="button"
                className="mt-3 sm:mt-0 inline-flex w-full sm:w-auto justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="inline-flex w-full sm:w-auto justify-center rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 active:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                onClick={handleExcluir}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
                    Excluindo...
                  </>
                ) : (
                  'Sim, Excluir Candidato'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
