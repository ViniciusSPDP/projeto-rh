
import prisma from '@/lib/prisma'
import { Candidatos } from '@/generated/prisma'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, User, Search, Filter, CircleCheck, CircleX, Loader } from 'lucide-react'

export const dynamic = 'force-dynamic' // Garante SSR atualizado a cada acesso

export default async function CandidatosPage({
  searchParams,
}: {
  searchParams?: { page?: string; search?: string; vaga?: string; situacao?: string }
}) {
  const page = parseInt(searchParams?.page || '1')
  const limit = 10
  const offset = (page - 1) * limit
  const { search, vaga, situacao } = searchParams || {}

  // Adiciona filtro por nome ou email se tiver pesquisa
  const filter = {
    ...(search && {
      OR: [
        { nomeCandidato: { contains: search, mode: 'insensitive' } },
        { emailCandidato: { contains: search, mode: 'insensitive' } },
      ]
    }),
    ...(vaga && { vagainteresseCandidato: { equals: vaga } }),
    ...(situacao && { situacaoCandidato: { equals: situacao } }),
  }

  const [candidatos, total] = await Promise.all([
    prisma.candidatos.findMany({
      where: filter,
      skip: offset,
      take: limit,
      orderBy: { created_at: 'desc' },
    }),
    prisma.candidatos.count({ where: filter }),
  ])

  const totalPages = Math.ceil(total / limit)

  // Função para gerar link de paginação mantendo os filtros
  const getPaginationLink = (pageNum: number) => {
    const params = new URLSearchParams()
    params.set('page', pageNum.toString())
    if (search) params.set('search', search)
    if (vaga) params.set('vaga', vaga)
    if (situacao) params.set('situacao', situacao)
    return `/candidatos?${params.toString()}`
  }

  // Gerar range de páginas para mostrar na paginação
  const getPaginationRange = () => {
    const delta = 2; // Número de páginas para mostrar antes e depois da página atual
    const range: (number | string)[] = []

    for (
      let i = Math.max(1, page - delta);
      i <= Math.min(totalPages, page + delta);
      i++
    ) {
      range.push(i)
    }

    // Adicionar primeira página e separador se necessário
    if (range.length > 0) {
      const firstItem = range[0] as number
      if (firstItem > 1) {
        range.unshift(1)
        if ((range[1] as number) > 2) {
          range.splice(1, 0, 'ellipsis')
        }
      }
    }

    // Adicionar última página e separador se necessário
    if (range.length > 0) {
      const lastItem = range[range.length - 1] as number
      if (lastItem < totalPages) {
        if (lastItem < totalPages - 1) {
          range.push('ellipsis')
        }
        range.push(totalPages)
      }
    }

    return range
  }

  // Status de cores para situação do candidato
  const getSituacaoStyle = (situacao: string | null | undefined) => {
    if (!situacao) return 'bg-gray-100 text-gray-800'

    switch (situacao.toLowerCase()) {
      case 'aprovado':
        return 'bg-blue-100 text-blue-800'
      case 'em análise':
        return 'bg-yellow-100 text-yellow-800'
      case 'contratado':
        return 'bg-green-100 text-green-800'
      case 'reprovado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const vagasOptions = [
    { value: "Administrativo", label: "Administrativo" },
    { value: "Reposição", label: "Reposição" },
    { value: "Expedição", label: "Expedição" },
    { value: "Recebimento", label: "Recebimento" },
    { value: "Entrega", label: "Entrega" },
    { value: "Financeiro", label: "Financeiro" },
    { value: "Compras", label: "Compras" },
    { value: "Fiscal", label: "Fiscal" },
    { value: "Vendas", label: "Vendas" },
    { value: "Marketing", label: "Marketing" },
    { value: "Conferência", label: "Conferência" },
    { value: "RH", label: "RH" },
    { value: "TI", label: "TI" },
  ]

  const situacaoOptions = [
    { value: "Aprovado", label: "Aprovado" },
    { value: "Reprovado", label: "Reprovado" },
    { value: "Contratado", label: "Contratado" },
    { value: "Em Análise", label: "Em Análise" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-blue-100">
          {/* Cabeçalho */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-lg mr-4 shadow-inner">
                  <User className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Candidatos</h1>
                  <p className="text-blue-100 mt-1">
                    Total de <span className="font-medium">{total}</span> candidato{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Seção de filtros melhorada */}
          <div className="bg-blue-50/50 border-b border-blue-100 p-6">
            <form
              action="/candidatos"
              method="GET"
              className="space-y-4"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-blue-400" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    defaultValue={search}
                    placeholder="Buscar por nome ou email..."
                    className="block w-full pl-10 pr-3 py-3 border border-blue-200 rounded-lg leading-5 bg-white placeholder-blue-400 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                    aria-label="Buscar candidatos"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 md:w-auto w-full">
                  <div className="relative">
                    <select
                      name="vaga"
                      defaultValue={searchParams?.vaga || ''}
                      className="appearance-none pl-3 pr-10 py-3 border border-blue-200 rounded-lg bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48 shadow-sm transition-all"
                    >
                      <option value="">Todas as Vagas</option>
                      {vagasOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Filter className="h-4 w-4 text-blue-500" />
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      name="situacao"
                      defaultValue={searchParams?.situacao || ''}
                      className="appearance-none pl-3 pr-10 py-3 border border-blue-200 rounded-lg bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48 shadow-sm transition-all"
                    >
                      <option value="">Todas as Situações</option>
                      {situacaoOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <Filter className="h-4 w-4 text-blue-500" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition shadow-sm font-medium flex items-center justify-center"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Filtrar
                  </button>
                </div>
              </div>

              <input type="hidden" name="page" value="1" />
            </form>
          </div>

          {/* Tabela de candidatos */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-blue-50 text-blue-900 text-left text-sm font-medium border-b border-blue-100">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4 hidden md:table-cell">Vaga Interesse</th>
                  <th className="px-6 py-4">Situação</th>
                  <th className="px-6 py-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-100">
                {candidatos.length > 0 ? (
                  candidatos.map((candidato: Candidatos) => (
                    <tr
                      key={candidato.idCandidato}
                      className="hover:bg-blue-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                        {candidato.idCandidato}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900 flex items-center gap-3">
                        {candidato.fotoCandidato ? (
                          <img
                            src={candidato.fotoCandidato}
                            alt="Foto"
                            className="w-10 h-10 rounded-full object-cover border border-blue-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                            <User className="w-5 h-5 text-blue-500" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{candidato.nomeCandidato}</div>
                          <div className="text-xs text-gray-500 hidden sm:block">{candidato.emailCandidato}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 hidden md:table-cell">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                          {candidato.vagainteresseCandidato}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getSituacaoStyle(candidato.situacaoCandidato)}`}>
                          {candidato.situacaoCandidato === 'Aprovado' && <CircleCheck className="w-4 h-4" />}
                          {candidato.situacaoCandidato === 'Reprovado' && <CircleX className="w-4 h-4" />}
                          {candidato.situacaoCandidato === 'Em Análise' && <Loader className="w-4 h-4 animate-spin" />}
                          {candidato.situacaoCandidato}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/candidatos/${candidato.idCandidato}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors group-hover:bg-blue-100"
                        >
                          <Search className="w-4 h-4" />
                          <span>Detalhes</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="w-12 h-12 text-blue-200 mb-3" />
                        <p className="text-gray-500 font-medium">Nenhum candidato encontrado</p>
                        <p className="text-gray-400 text-sm mt-1">Tente ajustar seus filtros de busca</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação melhorada */}
          {totalPages > 1 && (
            <div className="px-6 py-5 bg-gradient-to-b from-white to-blue-50 border-t border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Link
                    href={page > 1 ? getPaginationLink(page - 1) : '#'}
                    className={`relative inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md ${page > 1
                      ? 'bg-white text-blue-700 hover:bg-blue-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    aria-disabled={page <= 1}
                  >
                    Anterior
                  </Link>
                  <Link
                    href={page < totalPages ? getPaginationLink(page + 1) : '#'}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md ${page < totalPages
                      ? 'bg-white text-blue-700 hover:bg-blue-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    aria-disabled={page >= totalPages}
                  >
                    Próxima
                  </Link>
                </div>

                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-blue-700">
                      Mostrando <span className="font-medium">{Math.min(offset + 1, total)}</span> a{' '}
                      <span className="font-medium">{Math.min(offset + limit, total)}</span> de{' '}
                      <span className="font-medium">{total}</span> resultados
                    </p>
                  </div>

                  <nav className="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Paginação">
                    {/* Botão "Anterior" */}
                    <Link
                      href={page > 1 ? getPaginationLink(page - 1) : '#'}
                      className={`relative inline-flex items-center px-3 py-2 rounded-l-lg border border-blue-200 bg-white text-sm font-medium ${page > 1
                        ? 'text-blue-600 hover:bg-blue-50'
                        : 'text-gray-300 cursor-not-allowed'
                        }`}
                      aria-disabled={page <= 1}
                    >
                      <span className="sr-only">Anterior</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </Link>

                    {/* Números das páginas */}
                    {getPaginationRange().map((item, i) =>
                      item === 'ellipsis' ? (
                        <span
                          key={`ellipsis-${i}`}
                          className="relative inline-flex items-center px-4 py-2 border border-blue-200 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      ) : (
                        <Link
                          key={`page-${item}`}
                          href={getPaginationLink(item as number)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === item
                            ? 'z-10 bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50'
                            }`}
                          aria-current={page === item ? 'page' : undefined}
                        >
                          {item}
                        </Link>
                      )
                    )}

                    {/* Botão "Próxima" */}
                    <Link
                      href={page < totalPages ? getPaginationLink(page + 1) : '#'}
                      className={`relative inline-flex items-center px-3 py-2 rounded-r-lg border border-blue-200 bg-white text-sm font-medium ${page < totalPages
                        ? 'text-blue-600 hover:bg-blue-50'
                        : 'text-gray-300 cursor-not-allowed'
                        }`}
                      aria-disabled={page >= totalPages}
                    >
                      <span className="sr-only">Próxima</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}