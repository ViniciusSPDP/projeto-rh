'use client'

import { X } from 'lucide-react'
// 1. Importar o useCallback
import { useEffect, useRef, useState, useCallback } from 'react'

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export function Modal({ children, isOpen, onClose }: ModalProps) {
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
      // Inicia a animação de saída
      setShowContent(false)
      // Espera a animação terminar para fechar o dialog e restaurar o scroll
      setTimeout(() => {
        dialogRef.current?.close()
        document.body.style.overflow = 'auto';
      }, 300); // Mesmo tempo da transição do CSS
    }
  }, [isOpen])

  // 2. Envolver a função handleClose com useCallback
  // Isso garante que a função só seja recriada se a prop `onClose` mudar.
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleOutsideClick = (event: React.MouseEvent<HTMLDialogElement>) => {
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

    // Função de limpeza para remover o listener
    return () => {
      dialog?.removeEventListener('cancel', handleCancel);
    }
  }, [handleClose]); // 3. Adicionar handleClose ao array de dependências

  return (
    <dialog 
      ref={dialogRef}
      onClick={handleOutsideClick}
      className="bg-transparent p-0 w-full max-w-2xl rounded-lg m-auto
                 backdrop:bg-gray-800/50 backdrop-blur-sm"
    >
      <div 
        className={`bg-white rounded-lg shadow-2xl relative transition-all duration-300 ease-out
                   ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1 rounded-full hover:bg-gray-100"
          aria-label="Fechar modal"
        >
          <X size={24} />
        </button>
        <div className="p-6 sm:p-8">
          {children}
        </div>
      </div>
    </dialog>
  )
}
