import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import EtapaSelect from '@/app/components/EtapaSelect'
import BotaoFecharVaga from '@/app/components/BotaoFecharVaga'



export default async function DetalheVagaPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (isNaN(id)) return notFound()

  const vaga = await prisma.vaga.findUnique({
    where: { idVaga: id },
    include: {
      candidatos: {
        include: { candidato: true },
        orderBy: { created_at: 'asc' }
      },
    },
  })

  if (!vaga) return notFound()

  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-800">{vaga.titulo}</h1>
        {vaga.descricao && <p className="text-gray-700 mt-2">{vaga.descricao}</p>}
        <p className="text-sm text-blue-600 mt-1">Status: {vaga.status}</p>
        {vaga.status === 'Aberta' && (
          <div className="mt-2">
            <BotaoFecharVaga vagaId={vaga.idVaga} />
          </div>
        )}
      </div>




      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-700">Candidatos Vinculados</h2>
        <Link
          href={`/vagas/${id}/selecionar`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Adicionar Candidatos
        </Link>
      </div>

      {vaga.candidatos.length === 0 ? (
        <p className="text-gray-500">Nenhum candidato vinculado a esta vaga ainda.</p>
      ) : (
        <div className="grid gap-4">
          {vaga.candidatos.map((vc) => (
            <div
              key={vc.id}
              className="border border-blue-100 rounded p-4 bg-white shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-blue-800">
                  {vc.candidato?.nomeCandidato || '—'}
                </p>

                <EtapaSelect
                  vagaId={vaga.idVaga}
                  vagaCandidatoId={vc.id}
                  etapaAtual={vc.etapa}
                />

              </div>

              <Link
                href={`/candidatos/${vc.candidatoId}`}
                className="text-blue-600 hover:underline text-sm"
              >
                Ver detalhes
              </Link>
            </div>
          ))}

        </div>
      )}
    </main>
  )
}
