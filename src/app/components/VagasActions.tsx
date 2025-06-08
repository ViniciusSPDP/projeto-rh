// src/components/VagasActions.tsx

'use client'

import { useState } from 'react'
import { Modal } from './Modal'
import NovaVagaForm from './NovaVagaForm'
import { PlusCircle } from 'lucide-react'

// Componente para o botão principal no cabeçalho
export function BotaoCriarVaga() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="hidden cursor-pointer sm:inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
      >
        <PlusCircle size={20} />
        <span>Criar Nova Vaga</span>
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NovaVagaForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </>
  )
}

// Componente para o botão que aparece quando não há vagas
export function BotaoCriarPrimeiraVaga() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-6 inline-flex cursor-pointer items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
      >
        <PlusCircle size={20} />
        <span>Criar Primeira Vaga</span>
      </button>
       <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NovaVagaForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </>
  )
}