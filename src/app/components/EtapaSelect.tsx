'use client'

import { useState, useTransition } from 'react'
import {
  CheckCircle,
  CircleDashed,
  FileText,
  Frown,
  LoaderCircle,
  Mic,
  UserCheck,
  ChevronDown,
} from 'lucide-react'

// Interface para as propriedades do componente
interface Props {
  vagaId: number
  vagaCandidatoId: number
  etapaAtual: string
}

// Estrutura de dados para as etapas, com ícones e cores associadas
const ETAPAS_PROCESSO = [
  { id: 'Em processo', label: 'Em processo', Icon: CircleDashed, color: 'text-gray-600', bgColor: 'bg-gray-100' },
  { id: 'Entrevista', label: 'Entrevista', Icon: Mic, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { id: 'Teste prático', label: 'Teste prático', Icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { id: 'Finalista', label: 'Finalista', Icon: UserCheck, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  { id: 'Contratado', label: 'Contratado', Icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
  { id: 'Reprovado', label: 'Reprovado', Icon: Frown, color: 'text-red-600', bgColor: 'bg-red-100' },
]

export default function EtapaSelect({ vagaId, vagaCandidatoId, etapaAtual }: Props) {
  // O estado 'etapa' reflete a UI, permitindo uma atualização otimista.
  const [etapa, setEtapa] = useState(etapaAtual)
  // useTransition nos dá um estado de "pendente" para feedback de carregamento sem bloquear a UI.
  const [isPending, startTransition] = useTransition()

  const atualizarEtapa = async (novaEtapa: string) => {
    // Atualização otimista: a UI muda imediatamente.
    setEtapa(novaEtapa)

    // A chamada à API é envolvida na transição.
    startTransition(async () => {
      await fetch(`/api/vagas/${vagaId}/etapa/${vagaCandidatoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ etapa: novaEtapa }),
      })
      // Em uma aplicação maior, você poderia adicionar revalidação de dados aqui.
    })
  }

  // Encontra as propriedades visuais da etapa selecionada
  const etapaInfo = ETAPAS_PROCESSO.find((e) => e.id === etapa) || ETAPAS_PROCESSO[0]

  return (
    <div className="relative w-full">
      {/* Ícone à esquerda, que muda dinamicamente com a seleção */}
      <etapaInfo.Icon
        className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${etapaInfo.color}`}
        aria-hidden="true"
      />

      <select
        value={etapa}
        onChange={(e) => atualizarEtapa(e.target.value)}
        disabled={isPending}
        className={`w-full cursor-pointer appearance-none rounded-lg border border-gray-300 py-2 pl-10 pr-8 text-sm font-medium transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 
          ${isPending ? 'animate-pulse bg-gray-200' : `${etapaInfo.bgColor} ${etapaInfo.color}`}
        `}
        aria-label="Mudar etapa do candidato"
      >
        {ETAPAS_PROCESSO.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>

      {/* Ícone à direita, que mostra um spinner durante o carregamento */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        {isPending ? (
          <LoaderCircle className="h-5 w-5 animate-spin text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </div>
    </div>
  )
}
