'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ShieldX, LoaderCircle } from 'lucide-react'

export function BotaoFecharVaga({ vagaId }: { vagaId: number }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleEncerrarVaga = async () => {
    // Pede confirmação antes de uma ação destrutiva
    const confirmado = window.confirm(
      'Você tem certeza que deseja encerrar esta vaga? Esta ação não poderá ser desfeita e impedirá novas candidaturas.'
    )

    if (!confirmado) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/vagas/${vagaId}/fechar`, {
        method: 'PATCH',
      })

      if (res.ok) {
        toast.success('Vaga encerrada com sucesso!')
        router.refresh() // Atualiza a página para refletir o novo status
      } else {
        toast.error('Não foi possível encerrar a vaga.')
      }
    } catch (error) {
      toast.error('Ocorreu um erro de comunicação.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleEncerrarVaga}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
    >
      {loading ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        <ShieldX size={16} />
      )}
      <span>Encerrar Vaga</span>
    </button>
  )
}