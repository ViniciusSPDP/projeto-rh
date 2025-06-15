import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

// Este é o componente da sua página 404 personalizada com tema claro.
export default function NotFound() {
  return (
    // 1. Fundo alterado para branco e texto padrão para escuro
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-center text-gray-800">
      <div className="container mx-auto px-6">
        
        {/* 2. Cor do "404" ajustada para um cinza bem claro, criando um efeito de marca d'água */}
        <h1 className="text-9xl font-extrabold tracking-tighter text-gray-100 sm:text-[200px]">
          404
        </h1>

        {/* 3. Cor dos textos alterada para tons escuros para legibilidade */}
        <p className="-mt-8 sm:-mt-16 text-2xl font-semibold uppercase tracking-wider text-gray-700">
          Página Não Encontrada
        </p>
        <p className="mt-2 text-gray-500">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>

        {/* O botão já tem um bom contraste e não precisa de alteração */}
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-3 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-transform duration-300 hover:scale-105 hover:bg-blue-500 shadow-lg shadow-blue-500/30"
        >
          <FaArrowLeft />
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
}