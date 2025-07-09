'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { Modal } from './Modal'
import EditarVagaForm from './EditarVagaForm'

interface BotaoEditarVagaProps {
  vaga: { idVaga: number; titulo: string; descricao: string | null }
}

export function BotaoEditarVaga({ vaga }: BotaoEditarVagaProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-yellow-600"
      >
        <Pencil size={16} />
        <span>Editar Vaga</span>
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <EditarVagaForm vaga={vaga} onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  )
}