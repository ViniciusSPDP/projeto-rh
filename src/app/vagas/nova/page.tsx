'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NovaVagaPage() {
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/vagas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, descricao }),
    })

    if (res.ok) {
      router.push('/vagas')
    } else {
      alert('Erro ao criar vaga')
    }

    setLoading(false)
  }

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Cadastrar Nova Vaga</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md p-6 rounded-md border border-blue-100">
        <div>
          <label className="block text-blue-700 font-medium mb-1">Título da Vaga</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-blue-700 font-medium mb-1">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={4}
            className="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar Vaga'}
        </button>
      </form>
    </main>
  )
}
