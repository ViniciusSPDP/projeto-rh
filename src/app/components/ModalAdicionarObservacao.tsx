// app/components/ModalAdicionarObservacao.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Plus, X } from 'lucide-react'

interface ModalAdicionarObservacaoProps {
    candidatoId: number
    onSuccess: () => void
}

export default function ModalAdicionarObservacao({ 
    candidatoId, 
    onSuccess 
}: ModalAdicionarObservacaoProps) {
    const { data: session } = useSession()
    const router = useRouter()
    const [novaObservacao, setNovaObservacao] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!novaObservacao.trim()) {
            alert('Por favor, adicione uma observação')
            return
        }

        setIsSaving(true)

        try {
            const response = await fetch(`/api/candidatos/${candidatoId}/observacao/historico`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    observacao: novaObservacao,
                    createdBy: session?.user?.name?.split(' ')[0] || 'Usuário'
                })
            })

            if (response.ok) {
                setNovaObservacao('')
                onSuccess()
                router.refresh()
            } else {
                alert('Erro ao adicionar observação')
            }
        } catch (error) {
            console.error('Erro:', error)
            alert('Erro ao adicionar observação')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
                Adicionar Nova Observação
            </h2>
            
            <textarea
                value={novaObservacao}
                onChange={(e) => setNovaObservacao(e.target.value)}
                className="w-full min-h-[150px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Digite a nova observação..."
                autoFocus
            />
            
            <div className="flex gap-3 mt-4">
                <button
                    type="submit"
                    disabled={isSaving || !novaObservacao.trim()}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    {isSaving ? 'Adicionando...' : 'Adicionar'}
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