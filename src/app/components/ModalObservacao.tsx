// app/components/ModalObservacao.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, X } from 'lucide-react'

interface ModalObservacaoProps {
    candidatoId: number
    initialObservacao: string | null
    onSuccess: () => void
}

export default function ModalObservacao({ 
    candidatoId, 
    initialObservacao, 
    onSuccess 
}: ModalObservacaoProps) {
    const router = useRouter()
    const [observacao, setObservacao] = useState(initialObservacao || '')
    const [isSaving, setIsSaving] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            const response = await fetch(`/api/candidatos/${candidatoId}/observacao`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ observacao })
            })

            if (response.ok) {
                router.refresh() // Atualiza a página para mostrar a nova data
                onSuccess()
            } else {
                alert('Erro ao salvar observação')
            }
        } catch (error) {
            console.error('Erro:', error)
            alert('Erro ao salvar observação')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
                Editar Observação Interna
            </h2>
            
            <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                className="w-full min-h-[200px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Adicione observações internas sobre o candidato..."
            />
            
            <div className="flex gap-3 mt-4">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Salvando...' : 'Salvar'}
                </button>
                
                <button
                    type="button"
                    onClick={onSuccess}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    <X className="w-4 h-4" />
                    Cancelar
                </button>
            </div>
        </form>
    )
}