'use client'

import { useState } from 'react'

interface Props {
  vagaId: number
  vagaCandidatoId: number
  etapaAtual: string
}

export default function EtapaSelect({ vagaId, vagaCandidatoId, etapaAtual }: Props) {
  const [etapa, setEtapa] = useState(etapaAtual)

  const atualizarEtapa = async (novaEtapa: string) => {
    setEtapa(novaEtapa)
    await fetch(`/api/vagas/${vagaId}/etapa/${vagaCandidatoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ etapa: novaEtapa }),
    })
  }

  return (
    <select
      value={etapa}
      onChange={(e) => atualizarEtapa(e.target.value)}
      className="mt-1 border border-blue-300 rounded px-2 py-1 text-sm"
    >
      <option value="Em processo">Em processo</option>
      <option value="Entrevista">Entrevista</option>
      <option value="Teste prático">Teste prático</option>
      <option value="Finalista">Finalista</option>
      <option value="Contratado">Contratado</option>
      <option value="Reprovado">Reprovado</option>
    </select>
  )
}
