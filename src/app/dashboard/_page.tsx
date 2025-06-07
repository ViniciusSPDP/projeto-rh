import prisma from '@/lib/prisma'
import GraficoWrapper from './GraficoWrapper'
import Link from 'next/link'

export default async function DashboardPage() {
  const total = await prisma.candidatos.count()

  const porStatus = await prisma.candidatos.groupBy({
    by: ['situacaoCandidato'],
    _count: { situacaoCandidato: true },
  })

  const dadosGrafico = porStatus.map((item) => ({
    status: item.situacaoCandidato ?? 'Não definido',
    total: item._count.situacaoCandidato,
  }))

  const ultimos = await prisma.candidatos.findMany({
    orderBy: { created_at: 'desc' },
    take: 5,
    select: {
      idCandidato: true,
      nomeCandidato: true,
      created_at: true,
      situacaoCandidato: true,
    },
  })

  return (
    <main className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Dashboard</h1>

      {/* Cards de resumo */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500">Total de Candidatos</h2>
          <p className="text-2xl font-bold text-blue-700">{total}</p>
        </div>

        {dadosGrafico.map((s) => (
          <div key={s.status} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500">{s.status}</h2>
            <p className="text-2xl font-bold text-blue-700">{s.total}</p>
          </div>
        ))}
      </div>

      {/* Gráfico */}
      <div className="grid lg:grid-cols-2 mb-8">
        <GraficoWrapper dados={dadosGrafico} />
      </div>

      {/* Últimos cadastrados */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-blue-800 mb-4">Últimos Candidatos Cadastrados</h2>
        <ul className="divide-y divide-blue-100">
          {ultimos.map((c) => (
            <li key={c.idCandidato} className="py-3 flex justify-between">
              <Link
                href={`/candidatos/${c.idCandidato}`}
                className="text-blue-700 hover:underline"
              >
                {c.nomeCandidato}
              </Link>
              <span className="text-sm text-gray-500">
                {new Date(c.created_at).toLocaleDateString('pt-BR')}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
