// app/components/ObservacaoItem.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Edit2, Trash2, Check, X, Clock, User } from 'lucide-react'

interface ObservacaoItemProps {
  observacao: {
    id: number | string
    observacao: string
    createdAt: string
    createdBy?: string | null
    updatedAt?: string
    updatedBy?: string | null
  }
  onUpdate: () => void
}

export default function ObservacaoItem({ observacao, onUpdate }: ObservacaoItemProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(observacao.observacao)
  const [isDeleting, setIsDeleting] = useState(false)

  const formatarDataHora = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/observacao/${observacao.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          observacao: editedText,
          updatedBy: session?.user?.name?.split(' ')[0] || 'Usuário'
        })
      })

      if (response.ok) {
        setIsEditing(false)
        onUpdate()
        router.refresh()
      } else {
        alert('Erro ao salvar observação')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao salvar observação')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta observação?')) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/observacao/${observacao.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onUpdate()
        router.refresh()
      } else {
        alert('Erro ao excluir observação')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao excluir observação')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-yellow-50 p-4 rounded-md border-l-4 border-yellow-400 hover:border-yellow-500 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
            <Clock className="w-3 h-3" />
            <span>{formatarDataHora(observacao.createdAt)}</span>
            {observacao.createdBy && (
              <>
                <User className="w-3 h-3 ml-2" />
                <span>{observacao.createdBy}</span>
              </>
            )}
          </div>
          {observacao.updatedAt && observacao.updatedAt !== observacao.createdAt && (
            <div className="text-xs text-gray-500 italic">
              Editado em {formatarDataHora(observacao.updatedAt)}
              {observacao.updatedBy && ` por ${observacao.updatedBy}`}
            </div>
          )}
        </div>
        
        {!isEditing && (
          <div className="flex gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
              title="Editar observação"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1 text-red-600 hover:bg-red-100 rounded disabled:opacity-50"
              title="Excluir observação"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div>
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            rows={3}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Check className="w-4 h-4" />
              Salvar
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                setEditedText(observacao.observacao)
              }}
              className="flex items-center gap-1 px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 whitespace-pre-wrap">{observacao.observacao}</p>
      )}
    </div>
  )
}