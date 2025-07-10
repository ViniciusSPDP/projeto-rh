// app/processo-seletivo/page.tsx

import prisma from '@/lib/prisma'
import ProcessoSeletivoKanban from './ProcessoSeletivoKanban'

export const dynamic = 'force-dynamic'

const ETAPAS = ['Em Recrutamento', 'Seleção', 'Entrevista', 'Feedback', 'Contratado', 'Reprovado'] as const

async function getDados() {
  const vagasCandidatos = await prisma.vagaCandidato.findMany({
    where: {
      vaga: { status: 'Aberta' },
    },
    include: {
      vaga: { 
        select: { 
          idVaga: true,
          titulo: true,
          descricao: true,
          status: true
        } 
      },
      candidato: { 
        select: { 
          idCandidato: true, 
          nomeCandidato: true,
          emailCandidato: true,
          telefoneCandidato: true,
          fotoCandidato: true
        } 
      },
    },
    orderBy: { created_at: 'asc' },
  })

  // Converter BigInt e tipos para serialização
  return vagasCandidatos.map(vc => ({
    id: vc.id,
    vagaId: vc.vagaId,
    candidatoId: vc.candidatoId.toString(), // BigInt para string
    etapa: vc.etapa,
    created_at: vc.created_at.toISOString(),
    vaga: {
      idVaga: vc.vaga.idVaga,
      titulo: vc.vaga.titulo,
      descricao: vc.vaga.descricao,
      status: vc.vaga.status
    },
    candidato: vc.candidato ? {
      idCandidato: vc.candidato.idCandidato.toString(), // BigInt para string
      nomeCandidato: vc.candidato.nomeCandidato,
      emailCandidato: vc.candidato.emailCandidato,
      telefoneCandidato: vc.candidato.telefoneCandidato,
      fotoCandidato: vc.candidato.fotoCandidato
    } : null
  }))
}

export default async function ProcessoSeletivoPage() {
  const registros = await getDados()

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Processo Seletivo</h1>
          <p className="mt-2 text-gray-600">
            Gerencie candidatos através das etapas do processo seletivo
          </p>
        </div>
        
        <ProcessoSeletivoKanban 
          registrosIniciais={registros} 
          etapas={ETAPAS}
        />
      </div>
    </main>
  )
}