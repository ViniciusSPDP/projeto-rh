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
  Filter, // Ícone para a seção de filtros
} from 'lucide-react'
import Link from 'next/link'

// Tipagem atualizada para corresponder ao seu modelo
type Candidato = {
  idCandidato: number
  nomeCandidato: string
  emailCandidato: string 
}

// --- Componentes Modulares ---

function SearchBar({ initialSearch, onSearch }: { initialSearch: string; onSearch: (query: string) => void }) {
  const [query, setQuery] = useState(initialSearch)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }
  return (
    <form onSubmit={handleSubmit} className="relative w-full md:max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por nome, email..."
        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-11 pr-4 text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
    </form>
  )
}

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
        <p className={`truncate text-sm ${isSelected ? 'text-indigo-600' : 'text-gray-500'}`}>{candidato.emailCandidato}</p>
      </div>
    </li>
  )
}

// --- Componente para os Filtros ---
const VAGA_INTERESSE_OPTIONS = [
    { value: "Administrativo", label: "Administrativo" }, { value: "Reposição", label: "Reposição" },
    { value: "Expedição", label: "Expedição" }, { value: "Recebimento", label: "Recebimento" },
    { value: "Entrega", label: "Entrega" }, { value: "Financeiro", label: "Financeiro" },
    { value: "Compras", label: "Compras" }, { value: "Fiscal", label: "Fiscal" },
    { value: "Vendas", label: "Vendas" }, { value: "Marketing", label: "Marketing" },
    { value: "Conferência", label: "Conferência" }, { value: "RH", label: "RH" },
    { value: "TI", label: "TI" },
];

const SITUACAO_CANDIDATO_OPTIONS = [
    { value: "Reprovado", label: "Reprovado" }, { value: "Em processo", label: "Em processo" },
    { value: "Contratado", label: "Contratado" }, { value: "Em análise", label: "Em análise" },
];

function FilterDropdown({ label, value, options, onChange }: { label: string; value: string; options: {value: string; label: string}[]; onChange: (value: string) => void }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 bg-white py-2 pl-3 pr-10 text-base shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            >
                <option value="">Todos</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
    );
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

  // Lendo todos os parâmetros da URL, incluindo os novos filtros
  const page = Number(searchParams.get('page') || '1')
  const search = searchParams.get('search') || ''
  const vagaInteresse = searchParams.get('vaga_interesse') || ''
  const situacao = searchParams.get('situacao') || ''

  // O useEffect agora depende também dos filtros para re-buscar os dados
  useEffect(() => {
    const fetchCandidatos = async () => {
      setIsFetching(true)
      const urlParams = new URLSearchParams({
        vagaId: String(vagaId),
        page: String(page),
        search: search,
        vaga_interesse: vagaInteresse,
        situacao: situacao,
      })
      try {
        const res = await fetch(`/api/candidatos-disponiveis?${urlParams.toString()}`)
        const data = await res.json()
        setCandidatos(data)
      } catch (error) {
        console.error("Falha ao buscar candidatos:", error)
      } finally {
        setIsFetching(false)
      }
    }
    fetchCandidatos()
  }, [vagaId, page, search, vagaInteresse, situacao]) // Dependências atualizadas
  
  const handleNavigation = (newParams: URLSearchParams) => {
    router.push(`/vagas/${vagaId}/selecionar?${newParams.toString()}`)
  }
  
  // Função genérica para lidar com a mudança de qualquer filtro
  const handleFilterChange = (filterName: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (value) {
      newParams.set(filterName, value);
    } else {
      newParams.delete(filterName);
    }
    newParams.set('page', '1'); // Sempre reseta para a primeira página ao aplicar um filtro
    handleNavigation(newParams);
  }

  const handleSearch = (query: string) => {
    handleFilterChange('search', query);
  }

  const goToPage = (newPage: number) => {
    if (newPage < 1) return;
    handleFilterChange('page', String(newPage));
  }

  const toggleSelecionado = (id: number) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const vincularCandidatos = async () => {
    startTransition(async () => {
      await fetch(`/api/vagas/${vagaId}/vincular`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidatos: selecionados }),
      })
      router.push(`/vagas/${vagaId}`)
      router.refresh()
    })
  }

  return (
    <div className="mx-auto max-w-7xl py-10 px-4">
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
        </div>
      </header>
      
      {/* Barra de Busca e Filtros */}
      <div className="mb-6 grid grid-cols-1 items-end gap-4 rounded-lg border bg-gray-50 p-4 md:grid-cols-3">
        <div className="md:col-span-1 text-gray-700">
          <FilterDropdown
            label="Vaga de Interesse"
            options={VAGA_INTERESSE_OPTIONS}
            value={vagaInteresse}
            onChange={(value) => handleFilterChange('vaga_interesse', value)}
          />
        </div>
        <div className="md:col-span-1 text-gray-700">
          <FilterDropdown
            label="Situação do Candidato"
            options={SITUACAO_CANDIDATO_OPTIONS}
            value={situacao}
            onChange={(value) => handleFilterChange('situacao', value)}
          />
        </div>
        <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">Buscar por</label>
            <div className='mt-1'>
                 <SearchBar initialSearch={search} onSearch={handleSearch} />
            </div>
        </div>
      </div>
      
      <div className="min-h-[400px] rounded-lg bg-white p-6 shadow-sm">
        {isFetching ? (
          <div className="flex h-full min-h-[300px] items-center justify-center">
            <LoaderCircle className="h-12 w-12 animate-spin text-indigo-600" />
          </div>
        ) : candidatos.length === 0 ? (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
            <Users size={48} className="text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum candidato encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {search || vagaInteresse || situacao ? 'Nenhum candidato corresponde aos filtros aplicados.' : 'Todos os candidatos já estão nesta vaga.'}
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

        <button
          type="button"
          onClick={vincularCandidatos}
          disabled={isSubmitting || selecionados.length === 0}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
        >
          {isSubmitting ? (<LoaderCircle className="h-5 w-5 animate-spin" />) : (<UserPlus size={20} />)}
          <span>Vincular {selecionados.length > 0 ? `${selecionados.length} candidato(s)` : ''}</span>
        </button>
      </footer>
    </div>
  )
}