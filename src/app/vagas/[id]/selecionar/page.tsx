'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SelecionarCandidatosPage({ params }: { params: { id: string } }) {
  const vagaId = Number(params.id)
  const router = useRouter()
  const searchParams = useSearchParams()

  const [candidatos, setCandidatos] = useState<any[]>([])
  const [selecionados, setSelecionados] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  const page = Number(searchParams.get('page') || '1')
  const search = searchParams.get('search') || ''

  useEffect(() => {
    const fetchCandidatos = async () => {
      const res = await fetch(`/api/candidatos-disponiveis?vagaId=${vagaId}&page=${page}&search=${search}`)
      const data = await res.json()
      setCandidatos(data)
    }
    fetchCandidatos()
  }, [vagaId, page, search])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const input = form.search as HTMLInputElement
    const newSearch = input.value
    const params = new URLSearchParams()
    if (newSearch) params.set('search', newSearch)
    params.set('page', '1')
    router.push(`/vagas/${vagaId}/selecionar?${params.toString()}`)
  }

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    router.push(`/vagas/${vagaId}/selecionar?${params.toString()}`)
  }

  const toggleSelecionado = (id: number) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const vincular = async () => {
    setLoading(true)
    await fetch(`/api/vagas/${vagaId}/vincular`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidatos: selecionados }),
    })
    router.push(`/vagas/${vagaId}`)
  }

  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Selecionar Candidatos</h1>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Buscar por nome ou email"
          className="border px-3 py-2 rounded w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Buscar
        </button>
      </form>

      {candidatos.length === 0 ? (
        <p className="text-gray-500">Nenhum candidato disponível.</p>
      ) : (
        <form className="grid gap-4">
          {candidatos.map((c) => (
            <label key={c.idCandidato} className="flex items-center gap-2 bg-white p-4 border rounded shadow-sm">
              <input
                type="checkbox"
                value={c.idCandidato}
                checked={selecionados.includes(c.idCandidato)}
                onChange={() => toggleSelecionado(c.idCandidato)}
              />
              <span className="font-medium text-blue-800">{c.nomeCandidato}</span>
            </label>
          ))}

          <button
            type="button"
            onClick={vincular}
            disabled={loading || selecionados.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Vincular {selecionados.length} candidato(s)
          </button>

          {/* Paginação */}
          <div className="flex gap-2 mt-4">
            {page > 1 && (
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                className="text-blue-600 hover:underline"
              >
                Página anterior
              </button>
            )}
            {candidatos.length === 10 && (
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                className="text-blue-600 hover:underline"
              >
                Próxima página
              </button>
            )}
          </div>
        </form>
      )}
    </main>
  )
}
