// app/processo-seletivo/ProcessoSeletivoKanban.tsx

'use client'

import { useState, DragEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, Mail, Phone, User, Loader2 } from 'lucide-react'
import Image from 'next/image'


type Etapa = 'Em Recrutamento' | 'Seleção' | 'Entrevista' | 'Feedback' | 'Contratado' | 'Reprovado';

interface Candidato {
  idCandidato: string
  nomeCandidato: string | null
  emailCandidato: string | null
  telefoneCandidato: string | null
  fotoCandidato: string | null
}

interface Vaga {
  idVaga: number
  titulo: string
  descricao: string | null
  status: string
}

interface VagaCandidato {
  id: number
  vagaId: number
  candidatoId: string
  etapa: string
  created_at: string
  vaga: Vaga
  candidato: Candidato | null
}

interface Props {
  registrosIniciais: VagaCandidato[]
  etapas: readonly Etapa[]
}

export default function ProcessoSeletivoKanban({ registrosIniciais, etapas }: Props) {
  const router = useRouter()
  const [registros, setRegistros] = useState(registrosIniciais)
  const [draggedItem, setDraggedItem] = useState<VagaCandidato | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Organizar candidatos por etapa
  const grupos = etapas.reduce((acc, etapa) => {
    acc[etapa] = registros.filter(r => r.etapa === etapa)
    return acc
  }, {} as Record<Etapa, VagaCandidato[]>)

  // Corrigir registros sem etapa válida
  registros.forEach(registro => {
    if (!etapas.includes(registro.etapa as Etapa)) {
      grupos['Em Recrutamento'].push(registro)
    }
  })

  const handleDragStart = (e: DragEvent<HTMLDivElement>, item: VagaCandidato) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (etapa: string) => {
    setDragOverColumn(etapa)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>, novaEtapa: Etapa) => {
    e.preventDefault()
    setDragOverColumn(null)

    if (!draggedItem || draggedItem.etapa === novaEtapa) return

    setIsUpdating(true)

    try {
      // Atualizar no servidor
      const response = await fetch(`/api/vagas/${draggedItem.vagaId}/etapa/${draggedItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ etapa: novaEtapa })
      })

      if (response.ok) {
        // Atualizar estado local
        setRegistros(prev => 
          prev.map(r => 
            r.id === draggedItem.id 
              ? { ...r, etapa: novaEtapa }
              : r
          )
        )
        
        // Opcional: revalidar dados do servidor
        router.refresh()
      } else {
        alert('Erro ao mover candidato')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao mover candidato')
    } finally {
      setIsUpdating(false)
    }
  }

  const getColumnColor = (etapa: Etapa) => {
    const colors = {
      'Em Recrutamento': 'border-blue-500 bg-blue-50',
      'Seleção': 'border-purple-500 bg-purple-50', // Corrigido para roxo para variar
      'Entrevista': 'border-amber-500 bg-amber-50',  // Corrigido para âmbar para variar
      'Feedback': 'border-sky-500 bg-sky-50',       // Corrigido para azul-céu para variar
      'Contratado': 'border-green-600 bg-green-100', // <-- Adicionado
      'Reprovado': 'border-red-600 bg-red-100'      // <-- Adicionado
    };
    return colors[etapa] || 'border-gray-300 bg-gray-50'; // Cor padrão
};

const getHeaderColor = (etapa: Etapa) => {
    const colors = {
      'Em Recrutamento': 'bg-blue-500',
      'Seleção': 'bg-purple-500',
      'Entrevista': 'bg-amber-500',
      'Feedback': 'bg-sky-500',
      'Contratado': 'bg-green-600', // <-- Adicionado
      'Reprovado': 'bg-red-600'      // <-- Adicionado
    };
    return colors[etapa] || 'bg-gray-400'; // Cor padrão
};

  return (
    <div className="relative">
      {isUpdating && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80">
          <div className="flex items-center gap-2 rounded-lg bg-white p-4 shadow-lg">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span className="text-gray-700">Atualizando...</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {etapas.map((etapa) => (
          <div
            key={etapa}
            className={`rounded-lg border-2 transition-all ${
              dragOverColumn === etapa ? 'scale-105 shadow-xl' : ''
            } ${getColumnColor(etapa)}`}
            onDragOver={handleDragOver}
            onDragEnter={() => handleDragEnter(etapa)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, etapa)}
          >
            <div className={`rounded-t-md p-4 text-white ${getHeaderColor(etapa)}`}>
              <h2 className="text-lg font-semibold">{etapa}</h2>
              <p className="text-sm opacity-90">
                {grupos[etapa].length} candidato{grupos[etapa].length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="min-h-[400px] space-y-3 p-4">
              {grupos[etapa].length === 0 && (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                  <p className="text-sm text-gray-500">
                    Arraste candidatos para cá
                  </p>
                </div>
              )}
              
              {grupos[etapa].map((vc) => (
                <div
                  key={vc.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, vc)}
                  onDragEnd={handleDragEnd}
                  className={`cursor-move rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md ${
                    draggedItem?.id === vc.id ? 'opacity-50' : ''
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {vc.candidato?.fotoCandidato ? (
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            src={vc.candidato.fotoCandidato}
                            alt={vc.candidato.nomeCandidato || ''}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {vc.candidato?.nomeCandidato || 'Candidato removido'}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {vc.candidato?.idCandidato}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-2 flex items-center gap-1 text-sm text-gray-600">
                    <Briefcase className="h-3 w-3" />
                    <span className="font-medium">{vc.vaga.titulo}</span>
                  </div>

                  {vc.candidato?.emailCandidato && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{vc.candidato.emailCandidato}</span>
                    </div>
                  )}

                  {vc.candidato?.telefoneCandidato && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Phone className="h-3 w-3" />
                      <span>{vc.candidato.telefoneCandidato}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}