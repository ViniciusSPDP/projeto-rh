// src/app/vagas/[id]/page.tsx

import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, FileText, UserPlus, Users, ArrowLeft, ClipboardList, Share2, Tag, ShieldAlert } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import EtapaSelect from '@/app/components/EtapaSelect'
import { BotaoFecharVaga } from '@/app/components/BotaoFecharVaga'


async function getVaga(id: number) {
  const vaga = await prisma.vaga.findUnique({
    where: { idVaga: id },
    include: {
      candidatos: {
        include: { candidato: true },
        orderBy: { created_at: 'asc' },
      },
    },
  })
  return vaga
}

function StatusBadge({ status }: { status: string }) {
  const baseClasses = "px-3 py-1 text-xs font-medium rounded-full inline-block"
  if (status === 'Aberta') {
    return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>
  }
  return <span className={`${baseClasses} bg-red-100 text-red-800`}>{status}</span>
}

export default async function DetalheVagaPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (isNaN(id)) {
    return notFound()
  }

  const vaga = await getVaga(id)

  if (!vaga) {
    return notFound()
  }
  
  const publicUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/vagas/${vaga.idVaga}/formulario`
  const isVagaAberta = vaga.status === 'Aberta';

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <header className="bg-white shadow-sm rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <Link href="/vagas" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4">
              <ArrowLeft size={16} />
              Voltar para a lista de vagas
            </Link>
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg">
                <Briefcase size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{vaga.titulo}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <StatusBadge status={vaga.status} />
                  <span>•</span>
                  <span>Criada em {format(new Date(vaga.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0 self-start md:self-end">
            
            {/* --- AQUI ESTÁ A CORREÇÃO --- */}
            {isVagaAberta ? (
              // Se a vaga está aberta, renderiza o Link funcional
              <Link
                href={publicUrl}
                target="_blank"
                className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition"
              >
                <Share2 size={16} />
                <span>Ver Página Pública</span>
              </Link>
            ) : (
              // Se a vaga está encerrada, renderiza um span desabilitado
              <span
                className="inline-flex items-center gap-2 bg-gray-50 text-gray-400 px-4 py-2 rounded-lg cursor-not-allowed opacity-70"
                aria-disabled="true"
              >
                <Share2 size={16} />
                <span>Página Pública</span>
              </span>
            )}
            
            {isVagaAberta && <BotaoFecharVaga vagaId={vaga.idVaga} />}
          </div>
        </div>
        {vaga.descricao && 
          <div className="mt-6 border-t pt-4">
            <h2 className="font-semibold text-gray-700 mb-2">Descrição da Vaga</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{vaga.descricao}</p>
          </div>
        }
      </header>
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
              <ClipboardList size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Candidatos na Vaga</h2>
              <p className="text-sm text-gray-500">{vaga.candidatos.length} candidato(s) no total</p>
            </div>
          </div>
          {isVagaAberta && (
            <Link
              href={`/vagas/${id}/selecionar`}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition"
            >
              <UserPlus size={18} />
              Adicionar Candidato
            </Link>
          )}
        </div>

        {!isVagaAberta && (
            <div className="mb-6 rounded-md bg-yellow-50 p-4 border border-yellow-200">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <ShieldAlert className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-yellow-800">Esta vaga está encerrada. Não é mais possível adicionar ou alterar etapas de candidatos.</p>
                    </div>
                </div>
            </div>
        )}

        {vaga.candidatos.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <Users size={48} className="mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum candidato vinculado</h3>
            <p className="mt-1 text-sm text-gray-500">Adicione candidatos existentes ou compartilhe o link público.</p>
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {vaga.candidatos.map((vc) => (
                vc.candidato && <li key={vc.id} className="py-5">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                        {vc.candidato.nomeCandidato?.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-md font-semibold text-indigo-700 truncate">
                        {vc.candidato.nomeCandidato}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {vc.candidato.emailCandidato}
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-48">
                      <EtapaSelect
                        vagaId={vaga.idVaga}
                        vagaCandidatoId={vc.id}
                        etapaAtual={vc.etapa}
                        disabled={!isVagaAberta}
                      />
                    </div>
                    <div className="flex-shrink-0">
                      <Link
                        href={`/candidatos/${vc.candidatoId}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600"
                      >
                         <FileText size={16} />
                         <span>Detalhes</span>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}