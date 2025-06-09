// /app/obrigado/page.tsx (ou onde seu arquivo estiver)

import { CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ObrigadoPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md text-center">
        {/* Animação sutil no ícone */}
        <CheckCircle 
          className="mx-auto text-green-500 animate-pulse" 
          size={80} 
          strokeWidth={1.5}
        />
        
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
          Inscrição enviada!
        </h1>

        <p className="mt-4 text-base leading-7 text-gray-600">
          Agradecemos o seu interesse. Sua candidatura foi recebida com sucesso e será analisada pela nossa equipe. Desejamos boa sorte!
        </p>
        
        <div className="mt-10">
          <Link href="/">
            <span className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors">
              <ArrowLeft size={16} />
              Voltar para o início
            </span>
          </Link>
        </div>
      </div>
    </main>
  )
}