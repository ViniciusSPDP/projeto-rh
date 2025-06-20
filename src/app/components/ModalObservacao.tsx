// src/app/components/FormObservacao.tsx (Versão Melhorada)
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
// 1. Importando os ícones novos
import { Loader2, Save, X, ClipboardEdit } from 'lucide-react'

interface FormObservacaoProps {
  candidatoId: number | bigint
  initialObservacao: string | null
  onSuccess: () => void
}

// Definindo um limite para o contador de caracteres (opcional)
const MAX_CHARS = 1000;

export default function FormObservacao({
  candidatoId,
  initialObservacao,
  onSuccess,
}: FormObservacaoProps) {
  const router = useRouter()
  const [observacao, setObservacao] = useState(initialObservacao || '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setObservacao(initialObservacao || '')
  }, [initialObservacao])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/candidatos/${candidatoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          observacaoCandidato: observacao,
        }),
      })

      if (!res.ok) {
        throw new Error('Falha ao salvar observação.')
      }

      toast.success('Observação salva com sucesso!')
      router.refresh()
      onSuccess()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Ocorreu um erro.',
      )
    } finally {
      setLoading(false)
    }
  }

  // Limita o texto ao máximo de caracteres definido
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_CHARS) {
      setObservacao(e.target.value);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="border-b border-gray-200 px-6 pt-1 pb-4">
        {/* 2. Título com ícone */}
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <ClipboardEdit className="text-blue-600" size={22} />
          <span>Editar Observação do Candidato</span>
        </h2>
      </div>
      <div className="p-6">
        <textarea
          value={observacao}
          onChange={handleTextChange} // Usando a nova função para limitar caracteres
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-shadow"
          placeholder="Adicione suas anotações sobre o candidato aqui..."
        />
        {/* 3. Contador de caracteres */}
        <div className="text-right text-sm text-gray-500 mt-1">
          {observacao.length} / {MAX_CHARS}
        </div>
      </div>
      <div className="bg-gray-50 rounded-b-lg px-6 py-4 flex justify-end items-center gap-4">
        <button
          type="button"
          onClick={onSuccess}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          {/* 4. Ícone no botão Cancelar */}
          <X className="mr-2" size={18} />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2" size={18} />
          ) : (
            <Save className="mr-2" size={18} />
          )}
          Salvar
        </button>
      </div>
    </form>
  )
}