import prisma from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic' // Garante SSR atualizado

export default async function ListagemVagasPage() {
  const vagas = await prisma.vaga.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      candidatos: true, // quantidade de candidatos vinculados
    },
  })

  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Vagas em Aberto</h1>
        <Link
          href="/vagas/nova"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nova Vaga
        </Link>
      </div>

      <div className="grid gap-4">
        {vagas.length === 0 ? (
          <p className="text-gray-500">Nenhuma vaga cadastrada.</p>
        ) : (
          vagas.map((vaga) => (
            <div
              key={vaga.idVaga}
              className="border border-blue-100 rounded p-4 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-blue-700">{vaga.titulo}</h2>
                  {vaga.descricao && (
                    <p className="text-sm text-gray-600 mt-1">{vaga.descricao}</p>
                  )}
                  <p className="text-sm mt-2 text-blue-600">
                    Candidatos vinculados: {vaga.candidatos.length}
                  </p>
                </div>

                <Link
                  href={`/vagas/${vaga.idVaga}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Visualizar
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  )
}
