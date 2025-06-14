import prisma from '@/lib/prisma'
import GraficoWrapper from './GraficoWrapper'
import Link from 'next/link'
import { Users, TrendingUp, Clock, FileText, Calendar, Search } from 'lucide-react'

export default async function DashboardPage() {
  // Dados existentes
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

  // Novos dados para métricas avançadas
  const hoje = new Date()
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  const inicioSemana = new Date(hoje)
  inicioSemana.setDate(hoje.getDate() - 7)

  const candidatosMes = await prisma.candidatos.count({
    where: {
      created_at: {
        gte: inicioMes,
      },
    },
  })

  const candidatosSemana = await prisma.candidatos.count({
    where: {
      created_at: {
        gte: inicioSemana,
      },
    },
  })

  const aprovados = dadosGrafico.find(d => d.status.toLowerCase().includes('aprovado'))?.total || 0
  const emAndamento = dadosGrafico.find(d => d.status.toLowerCase().includes('processo') || d.status.toLowerCase().includes('andamento'))?.total || 0

  // Função para determinar a cor do status
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower.includes('aprovado') || statusLower.includes('contratado')) return 'text-green-600 bg-green-100'
    if (statusLower.includes('reprovado') || statusLower.includes('Reprovado')) return 'text-red-600 bg-red-100'
    if (statusLower.includes('processo') || statusLower.includes('andamento')) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Dashboard de Recrutamento</h1>
            <p className="text-slate-600">Acompanhe suas métricas de recrutamento em tempo real</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <Link
              href="/candidatos/novo"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <Users size={20} />
              Novo Candidato
            </Link>
            <Link
              href="/relatorios"
              className="bg-white hover:bg-gray-50 text-slate-700 px-4 py-2 rounded-lg font-medium border border-gray-200 transition-colors duration-200 flex items-center gap-2"
            >
              <FileText size={20} />
              Relatórios
            </Link>
          </div>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-1">Total de Candidatos</h3>
              <p className="text-3xl font-bold text-slate-800">{total}</p>
              <p className="text-sm text-green-600 mt-1">+{candidatosMes} este mês</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-1">Aprovados</h3>
              <p className="text-3xl font-bold text-slate-800">{aprovados}</p>
              <p className="text-sm text-slate-500 mt-1">{total > 0 ? Math.round((aprovados / total) * 100) : 0}% do total</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-1">Em Processo</h3>
              <p className="text-3xl font-bold text-slate-800">{emAndamento}</p>
              <p className="text-sm text-slate-500 mt-1">Aguardando análise</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-1">Esta Semana</h3>
              <p className="text-3xl font-bold text-slate-800">{candidatosSemana}</p>
              <p className="text-sm text-blue-600 mt-1">Novos cadastros</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Distribuição por status - Cards menores */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {dadosGrafico.map((s) => (
          <div key={s.status} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide">{s.status}</h4>
                <p className="text-xl font-bold text-slate-800 mt-1">{s.total}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(s.status)}`}>
                {Math.round((s.total / total) * 100)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Seção principal com gráfico e lista */}
      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Gráfico */}
        <div className="lg:col-span-1">
          <GraficoWrapper dados={dadosGrafico} />
        </div>

        {/* Últimos cadastrados - versão aprimorada */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">Últimos Candidatos</h2>
              <Link
                href="/candidatos"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
              >
                Ver todos
                <Search size={16} />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {ultimos.map((c, index) => (
                <div key={c.idCandidato} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors duration-200 border border-transparent hover:border-slate-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {/* CORREÇÃO AQUI */}
                      {c.nomeCandidato?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                    <div>
                      <Link
                        href={`/candidatos/${c.idCandidato}`}
                        className="text-slate-800 hover:text-blue-600 font-medium transition-colors duration-200"
                      >
                        {/* CORREÇÃO AQUI */}
                        {c.nomeCandidato ?? 'Candidato sem nome'}
                      </Link>
                      <p className="text-sm text-slate-500 mt-1">
                        {/* A data também precisa de uma verificação, por segurança */}
                        Cadastrado em {c.created_at ? new Date(c.created_at).toLocaleDateString('pt-BR') : 'Data desconhecida'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(c.situacaoCandidato || 'Não definido')}`}>
                      {c.situacaoCandidato || 'Não definido'}
                    </span>
                    <div className="text-slate-400 text-sm">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Seção de ações rápidas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Ações Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/candidatos"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
          >
            <Users className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-200" />
            <h3 className="font-semibold text-slate-800">Gerenciar Candidatos</h3>
            <p className="text-sm text-slate-600 mt-1">Visualizar e editar candidatos</p>
          </Link>

          <Link
            href="/vagas"
            className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 group"
          >
            <FileText className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform duration-200" />
            <h3 className="font-semibold text-slate-800">Vagas Abertas</h3>
            <p className="text-sm text-slate-600 mt-1">Gerenciar posições disponíveis</p>
          </Link>

          <Link
            href="/relatorios"
            className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
          >
            <TrendingUp className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-200" />
            <h3 className="font-semibold text-slate-800">Relatórios</h3>
            <p className="text-sm text-slate-600 mt-1">Análises e estatísticas</p>
          </Link>
        </div>
      </div>
    </main>
  )
}