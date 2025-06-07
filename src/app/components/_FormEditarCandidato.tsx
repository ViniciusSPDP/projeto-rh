'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FormEditarCandidato({ candidato }: { candidato: any }) {
  const router = useRouter()
  const [nome, setNome] = useState(candidato.nomeCandidato || '')
  const [email, setEmail] = useState(candidato.emailCandidato || '')
  const [telefone, setTelefone] = useState(candidato.telefoneCandidato || '')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch(`/api/candidatos/${candidato.idCandidato}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nomeCandidato: nome,
        emailCandidato: email,
        telefoneCandidato: telefone,
      }),
    })

    if (res.ok) {
      router.push(`/candidatos/${candidato.idCandidato}`)
    } else {
      alert('Erro ao atualizar candidato')
    }

    setLoading(false)
  }

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Editar Candidato</h1>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium text-blue-700">Nome</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium text-blue-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium text-blue-700">Telefone</label>
        <input
          type="text"
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Salvando...' : 'Salvar alterações'}
      </button>
    </form>
    </main>

  )

}
