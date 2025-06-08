'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Briefcase, Save, Loader2 } from 'lucide-react'

// Componente auxiliar. Nenhuma mudança aqui.
function FormField({ label, children, required = false }: { label: string, children: React.ReactNode, required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="mt-1">
        {children}
      </div>
    </div>
  )
}

// ALTERAÇÃO 1: Nome do componente e props
export default function NovaVagaForm({ onSuccess }: { onSuccess: () => void }) {
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!titulo.trim()) {
      toast.error('O título da vaga é obrigatório.');
      return;
    }

    setLoading(true)

    try {
      const res = await fetch('/api/vagas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, descricao }),
      })

      if (res.ok) {
        toast.success('Vaga criada com sucesso!')
        
        // ALTERAÇÃO 2: Ação de sucesso foi modificada
        router.refresh() // Mantém para atualizar a lista de vagas na página principal
        onSuccess()      // Chama a função para fechar a modal
        
      } else {
        toast.error('Não foi possível criar a vaga. Tente novamente.')
      }
    } catch (error) {
      toast.error('Ocorreu um erro de conexão.')
      console.error("Falha ao criar vaga:", error)
    } finally {
      setLoading(false)
    }
  }

  const inputClasses = "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"

  // ALTERAÇÃO 3: Layout de página removido. Retornamos o conteúdo diretamente.
  return (
    <div className="w-full">
      <div className="flex items-center space-x-3 mb-8">
        <Briefcase className="h-8 w-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-800">Cadastrar Nova Vaga</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <FormField label="Título da Vaga" required>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className={inputClasses}
              placeholder="Ex: Vendedor(a) Interno"
            />
          </FormField>

          <FormField label="Descrição da Vaga">
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={8}
              className={inputClasses}
              placeholder="Descreva as responsabilidades, requisitos e benefícios da vaga."
            />
          </FormField>
        </div>

        <div className="flex justify-end pt-8 mt-8 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Salvar Vaga
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}