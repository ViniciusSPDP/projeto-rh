'use client'

import { Printer } from 'lucide-react'

export default function BotaoImprimir({ id }: { id: number }) {
  return (
    <button 
      onClick={() => window.open(`/candidatos/imprimir/${id}`, '_blank')}
      className="inline-flex items-center justify-center cursor-pointer px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
    >
      <Printer className="w-4 h-4 mr-2" />
      Imprimir CV
    </button>
  )
}
