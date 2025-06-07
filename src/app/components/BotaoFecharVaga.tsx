'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BotaoFecharVaga({ vagaId }: { vagaId: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const fechar = async () => {
    if (!confirm('Tem certeza que deseja fechar esta vaga?')) return

    setLoading(true)
    await fetch(`/api/vagas/${vagaId}/fechar`, {
      method: 'PATCH',
    })

    router.refresh()
  }

  return (
    <button
      onClick={fechar}
      disabled={loading}
      className="text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-50 transition disabled:opacity-50"
    >
      Fechar Vaga
    </button>
  )
}
