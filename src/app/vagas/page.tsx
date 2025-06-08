// src/app/vagas/page.tsx

import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Briefcase, Users, ArrowRight, Calendar, Tag } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { BotaoCriarVaga, BotaoCriarPrimeiraVaga } from '@/app/components/VagasActions'

export const dynamic = 'force-dynamic'

type VagaComContagem = Awaited<ReturnType<typeof getVagas>>[0]

async function getVagas() {
  const vagas = await prisma.vaga.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      _count: {
        select: { candidatos: true },
      },
    },
  })
  return vagas
}

// --- Componentes Modulares ---

// ALTERAÇÃO FEITA AQUI: O componente agora só tem os status 'Aberta' e 'Encerrada'
function StatusBadge({ status }: { status: string }) {
  const styleMap = {
    Aberta: 'bg-green-100 text-green-800',
    Encerrada: 'bg-red-100 text-red-800', // Ajustado de "Fechada" para "Encerrada"
  }
  const defaultStyle = 'bg-gray-100 text-gray-800';
  const badgeStyle = styleMap[status as keyof typeof styleMap] || defaultStyle;

  return (
    <span className={`inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium ${badgeStyle}`}>
      <Tag className="h-3.5 w-3.5" />
      {status}
    </span>
  )
}


function VagaCard({ vaga }: { vaga: VagaComContagem }) {
  return (
    <li className="col-span-1 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 divide-y divide-gray-200 border border-transparent hover:border-indigo-300 flex flex-col">
      <div className="flex-1 w-full flex flex-col p-6 space-y-4">
        
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-gray-900 text-xl font-semibold truncate group-hover:text-indigo-600 flex-1">
            <Link href={`/vagas/${vaga.idVaga}`} className="hover:text-indigo-600 transition-colors">
              {vaga.titulo}
            </Link>
          </h3>
          <StatusBadge status={vaga.status} />
        </div>
        
        <div className="flex-1">
          {vaga.descricao && (
            <p className="mt-1 text-gray-500 text-sm h-10 overflow-hidden text-ellipsis">{vaga.descricao}</p>
          )}
        </div>

        <div className="flex items-center text-xs text-gray-400">
          <Calendar className="w-4 h-4 mr-1.5" />
          <span>Criada em {format(new Date(vaga.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
        </div>
      </div>
      <div>
        <div className="-mt-px flex divide-x divide-gray-200">
          <div className="w-0 flex-1 flex">
            <div className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center gap-x-3 py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg">
              <Users className="w-5 h-5 text-gray-400" />
              <span>{vaga._count.candidatos} {vaga._count.candidatos === 1 ? 'Candidato' : 'Candidatos'}</span>
            </div>
          </div>
          <div className="-ml-px w-0 flex-1 flex">
            <Link
              href={`/vagas/${vaga.idVaga}`}
              className="relative w-0 flex-1 inline-flex items-center justify-center gap-x-3 py-4 text-sm text-indigo-600 font-semibold border border-transparent rounded-br-lg hover:bg-indigo-50 hover:text-indigo-800 transition-colors"
            >
              <span>Ver Detalhes</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </li>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-20 px-6 bg-white rounded-lg shadow-md col-span-1 sm:col-span-2 lg:col-span-3">
      <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhuma vaga encontrada</h3>
      <p className="mt-1 text-sm text-gray-500">Seja o primeiro a criar uma oportunidade na sua empresa.</p>
      <BotaoCriarPrimeiraVaga />
    </div>
  )
}

export default async function ListagemVagasPage() {
  const vagas = await getVagas()

  return (
    <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between mb-10 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Painel de Vagas</h1>
          <p className="mt-1 text-md text-gray-500">Gerencie suas oportunidades e acompanhe os processos seletivos.</p>
        </div>
        {vagas.length > 0 && (
          <BotaoCriarVaga />
        )}
      </header>

      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {vagas.length === 0 ? (
          <EmptyState />
        ) : (
          vagas.map((vaga) => (
            <VagaCard key={vaga.idVaga} vaga={vaga} />
          ))
        )}
      </ul>
    </main>
  )
}