import prisma from '@/lib/prisma'
import { Candidatos } from '@/generated/prisma'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, User, Search, Filter, CircleCheck, CircleX, Loader } from 'lucide-react'

export const dynamic = 'force-dynamic' // Garante SSR atualizado a cada acesso

export default async function CandidatosPage({
  searchParams,
}: {
  searchParams?: { page?: string; search?: string }
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

  return (

    <main className="min-h-screen bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Cabeçalho */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center">
                <User className="mr-3 h-8 w-8" />
                <h1 className="text-2xl font-bold">Candidatos</h1>
              </div>

              {/* Barra de pesquisa */}
              <form className="relative flex-1 max-w-md" action="/candidatos" method="GET">
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Buscar candidatos..."
                  className="block w-full pl-10 pr-3 py-2 border border-blue-300 rounded-md leading-5 bg-blue-50 placeholder-blue-400 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Buscar candidatos"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-blue-400" />
                </div>

                <div className="flex flex-wrap gap-4 mt-4">
                  <select
                    name="vaga"
                    defaultValue={searchParams?.vaga || ''}
                    className="px-3 py-2 border border-blue-300 rounded-md text-sm text-blue-900"
                  >
                    <option value="">Todas as Vagas</option>
                    <option value="Administrativo">Administrativo</option>
                    <option value="Reposição">Reposição</option>
                    <option value="Expedição">Expedição</option>
                    <option value="Recebimento">Recebimento</option>
                    <option value="Entrega">Entrega</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Compras">Compras</option>
                    <option value="Fiscal">Fiscal</option>
                    <option value="Vendas">Vendas</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Conferência">Conferência</option>
                    <option value="RH">RH</option>
                    <option value="TI">TI</option>
                  </select>

                  <select
                    name="situacao"
                    defaultValue={searchParams?.situacao || ''}
                    className="px-3 py-2 border border-blue-300 rounded-md text-sm text-blue-900"
                  >
                    <option value="">Todas as Situações</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Reprovado">Reprovado</option>
                    <option value="Contratado">Contratado</option>
                    <option value="Em Análise">Em Análise</option>
                  </select>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition"
                  >
                    Filtrar
                  </button>
                </div>




                <input type="hidden" name="page" value="1" />
              </form>
            </div>

            <p className="mt-2 text-blue-100">
              Total de {total} candidato{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Tabela de candidatos */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-blue-50 text-blue-900 text-left text-sm font-medium">
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
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">
                        {candidato.idCandidato}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900 flex items-center gap-3">
                        {candidato.fotoCandidato ? (
                          <img
                            src={candidato.fotoCandidato}
                            alt="Foto"
                            className="w-8 h-8 rounded-full object-cover border border-blue-300"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-500" />
                          </div>
                        )}
                        {candidato.nomeCandidato}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                        {candidato.vagainteresseCandidato}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`flex items-center gap-2 ${getSituacaoStyle(candidato.situacaoCandidato)}`}>
                          {candidato.situacaoCandidato === 'Aprovado' && <CircleCheck className="w-4 h-4" />}
                          {candidato.situacaoCandidato === 'Reprovado' && <CircleX className="w-4 h-4" />}
                          {candidato.situacaoCandidato === 'Em Análise' && <Loader className="w-4 h-4 animate-spin" />}
                          {candidato.situacaoCandidato}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/candidatos/${candidato.idCandidato}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <Search className="w-4 h-4" />
                          Detalhes
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                      Nenhum candidato encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação melhorada */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
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

                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Paginação">
                    {/* Botão "Anterior" */}
                    <Link
                      href={page > 1 ? getPaginationLink(page - 1) : '#'}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-blue-300 bg-white text-sm font-medium ${page > 1
                        ? 'text-blue-500 hover:bg-blue-50'
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
                          className="relative inline-flex items-center px-4 py-2 border border-blue-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      ) : (
                        <Link
                          key={`page-${item}`}
                          href={getPaginationLink(item as number)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === item
                            ? 'z-10 bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-blue-300 text-blue-600 hover:bg-blue-50'
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
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-blue-300 bg-white text-sm font-medium ${page < totalPages
                        ? 'text-blue-500 hover:bg-blue-50'
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