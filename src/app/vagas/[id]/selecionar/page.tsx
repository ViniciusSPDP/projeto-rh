'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Search,
  UserPlus,
  LoaderCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Check,
} from 'lucide-react'
import Link from 'next/link'

// Define a tipagem para o objeto de candidato para maior segurança de tipo.
type Candidato = {
  idCandidato: number
  nomeCandidato: string
  email: string
}

// --- Componentes Modulares para uma UI mais limpa ---

// Componente para a Barra de Busca
function SearchBar({ initialSearch, onSearch }: { initialSearch: string; onSearch: (query: string) => void }) {
  const [query, setQuery] = useState(initialSearch)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full md:max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por nome, email ou CPF..."
        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-11 pr-4 text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
    </form>
  )
}

// Componente para o Card de Candidato na lista
function CandidatoCard({ candidato, isSelected, onToggle }: { candidato: Candidato; isSelected: boolean; onToggle: (id: number) => void; }) {
  return (
    <li
      onClick={() => onToggle(candidato.idCandidato)}
      className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-all duration-200 ${
        isSelected
          ? 'border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-500'
          : 'border-gray-200 bg-white shadow-sm hover:border-indigo-400 hover:shadow-lg'
      }`}
    >
      <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`}>
        {isSelected && <Check className="h-4 w-4 text-white" />}
      </div>
      <div className="flex-shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-500">
          {candidato.nomeCandidato?.charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-md font-semibold ${isSelected ? 'text-indigo-800' : 'text-gray-800'}`}>
          {candidato.nomeCandidato}
        </p>
        <p className={`truncate text-sm ${isSelected ? 'text-indigo-600' : 'text-gray-500'}`}>{candidato.email}</p>
      </div>
    </li>
  )
}

// --- Componente Principal da Página ---

export default function SelecionarCandidatosPage({ params }: { params: { id: string } }) {
  const vagaId = Number(params.id)
  const router = useRouter()
  const searchParams = useSearchParams()

  const [candidatos, setCandidatos] = useState<Candidato[]>([])
  const [selecionados, setSelecionados] = useState<number[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const [isSubmitting, startTransition] = useTransition()

  const page = Number(searchParams.get('page') || '1')
  const search = searchParams.get('search') || ''

  // Efeito para buscar os candidatos disponíveis na API
  useEffect(() => {
    const fetchCandidatos = async () => {
      setIsFetching(true)
      try {
        const res = await fetch(`/api/candidatos-disponiveis?vagaId=${vagaId}&page=${page}&search=${search}`)
        const data = await res.json()
        setCandidatos(data)
      } catch (error) {
        console.error("Falha ao buscar candidatos:", error)
        // Opcional: Adicionar estado de erro para mostrar na UI
      } finally {
        setIsFetching(false)
      }
    }
    fetchCandidatos()
  }, [vagaId, page, search])
  
  // Funções para manipular a navegação e a busca
  const handleNavigation = (newParams: URLSearchParams) => {
    router.push(`/vagas/${vagaId}/selecionar?${newParams.toString()}`)
  }

  const handleSearch = (query: string) => {
    const newParams = new URLSearchParams(searchParams.toString())
    if (query) {
      newParams.set('search', query)
    } else {
      newParams.delete('search')
    }
    newParams.set('page', '1')
    handleNavigation(newParams)
  }

  const goToPage = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams.toString())
    // AQUI ESTÁ A CORREÇÃO:
    // A linha abaixo estava 'params.set(...)' e deveria ser 'newParams.set(...)'
    newParams.set('page', String(newPage))
    // E aqui passamos a variável correta 'newParams'
    handleNavigation(newParams)
  }

  // Função para (de)selecionar um candidato
  const toggleSelecionado = (id: number) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  // Função para vincular os candidatos selecionados à vaga
  const vincularCandidatos = async () => {
    startTransition(async () => {
      await fetch(`/api/vagas/${vagaId}/vincular`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidatos: selecionados }),
      })
      router.push(`/vagas/${vagaId}`)
      router.refresh() // Força a atualização dos dados na página de destino
    })
  }

  return (
    <div className="mx-auto max-w-4xl py-10 px-4">
      <header className="mb-8">
        <Link href={`/vagas/${vagaId}`} className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800">
          <ArrowLeft size={16} />
          Voltar para a vaga
        </Link>
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Adicionar Candidatos</h1>
            <p className="mt-1 text-gray-500">Selecione os candidatos que deseja vincular a esta vaga.</p>
          </div>
          <SearchBar initialSearch={search} onSearch={handleSearch} />
        </div>
      </header>
      
      <div className="min-h-[400px] rounded-lg bg-white p-6 shadow-sm">
        {isFetching ? (
          <div className="flex h-full min-h-[300px] items-center justify-center">
            <LoaderCircle className="h-12 w-12 animate-spin text-indigo-600" />
          </div>
        ) : candidatos.length === 0 ? (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
            <Users size={48} className="text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum candidato disponível</h3>
            <p className="mt-1 text-sm text-gray-500">
              {search ? 'Tente uma busca diferente ou verifique a grafia.' : 'Todos os candidatos já estão nesta vaga ou não há candidatos cadastrados.'}
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {candidatos.map((c) => (
              <CandidatoCard
                key={c.idCandidato}
                candidato={c}
                isSelected={selecionados.includes(c.idCandidato)}
                onToggle={toggleSelecionado}
              />
            ))}
          </ul>
        )}
      </div>

      <footer className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Paginação */}
        <div className="flex items-center gap-2">
           <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1 || isFetching}
            className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
          >
            <ChevronLeft size={16} />
            Anterior
          </button>
          <span className="text-sm font-medium text-gray-600">Página {page}</span>
          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={candidatos.length < 10 || isFetching}
            className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
          >
            Próxima
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Botão de Ação Principal */}
        <button
          type="button"
          onClick={vincularCandidatos}
          disabled={isSubmitting || selecionados.length === 0}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
        >
          {isSubmitting ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            <UserPlus size={20} />
          )}
          <span>
            Vincular {selecionados.length > 0 ? `${selecionados.length} candidato(s)` : ''}
          </span>
        </button>
      </footer>
    </div>
  )
}
