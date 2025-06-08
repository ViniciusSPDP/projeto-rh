// src/components/Modal.tsx

'use client'

import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function Modal({ children, isOpen, onClose }: { children: React.ReactNode, isOpen: boolean, onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal()
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        setShowContent(true)
      }, 50);
    } else {
      setShowContent(false)
      setTimeout(() => {
        dialogRef.current?.close()
        document.body.style.overflow = 'auto';
      }, 300);
    }
  }, [isOpen])

  const handleClose = () => {
    onClose();
  }

  // 1. NOVA FUNÇÃO PARA DETECTAR O CLIQUE EXTERNO
  const handleOutsideClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    // Se o alvo do clique for o próprio dialog (o fundo), fecha a modal.
    if (event.target === dialogRef.current) {
      handleClose();
    }
  }
  
  // Efeito para fechar com a tecla 'Esc'
  useEffect(() => {
    const dialog = dialogRef.current
    const handleCancel = (event: Event) => {
      event.preventDefault();
      handleClose();
    };
    dialog?.addEventListener('cancel', handleCancel);
    return () => dialog?.removeEventListener('cancel', handleCancel);
  }, []); // A dependência pode continuar vazia pois handleClose não muda

  return (
    <dialog 
      ref={dialogRef}
      // 2. ADICIONAMOS O EVENTO DE ONCLICK AQUI
      onClick={handleOutsideClick}
      className="bg-transparent p-0 w-full max-w-2xl rounded-lg m-auto
                 backdrop:bg-gray-500/30 backdrop:blur-sm"
    >
      <div 
        className={`bg-white rounded-lg shadow-2xl relative transition-all duration-300 ease-in-out
                   ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
          aria-label="Fechar modal"
        >
          <X size={24} />
        </button>
        <div className="p-8">
          {children}
        </div>
      </div>
    </dialog>
  )
}