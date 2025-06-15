// src/app/vagas/[id]/formulario/page.tsx

import prisma from '@/lib/prisma'
import FormCandidatoPublico from '@/app/components/FormCandidatoPublico' // Corrigindo o caminho da importação
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link' // Certifique-se de que o Link está importado
import { Metadata } from 'next'; // 1. Importe o tipo Metadata

// 2. Crie a função generateMetadata
interface FormularioPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: FormularioPageProps): Promise<Metadata> {
  const vagaId = Number(params.id);

  if (isNaN(vagaId)) {
    return {
      title: 'Vaga não encontrada',
      description: 'Esta vaga não foi encontrada em nosso sistema.',
    };
  }

  const vaga = await prisma.vaga.findUnique({
    where: { idVaga: vagaId },
  });

  if (!vaga) {
    return {
      title: 'Vaga não encontrada',
      description: 'Esta vaga não foi encontrada em nosso sistema.',
    };
  }

  const tituloVaga = `Candidate-se para: ${vaga.titulo}`;
  
  // CORREÇÃO AQUI: Verificamos se vaga.descricao não é nula antes de usá-la.
  const descricaoVaga = vaga.descricao
    ? vaga.descricao.substring(0, 155).trim() + '...'
    : `Veja mais detalhes e candidate-se para a vaga de ${vaga.titulo}.`; // Descrição padrão

  return {
    title: tituloVaga,
    description: descricaoVaga,
    openGraph: {
      title: tituloVaga,
      description: descricaoVaga,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: tituloVaga,
      description: descricaoVaga,
    },
  };
}



// Componente para a tela de vaga encerrada (sem alterações)
function VagaEncerrada() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="mx-auto w-full max-w-md rounded-lg bg-white p-8 text-center shadow-xl">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
        <h1 className="mt-4 text-2xl font-bold text-gray-800">Processo Seletivo Encerrado</h1>
        <p className="mt-2 text-gray-600">
          Agradecemos seu interesse, mas as inscrições para esta vaga já foram finalizadas.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Gostaria de deixar seu currículo em nosso banco de talentos para futuras oportunidades?
        </p>
        {/* --- ALTERAÇÃO AQUI --- */}
        <div className="mt-6">
          <Link
            href="/banco-de-talentos"
            className="inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Cadastrar no Banco de Talentos
          </Link>
        </div>
      </div>
    </div>
  )
}
export default async function FormularioVagaPage({ params }: { params: { id: string } }) {
  const vagaId = Number(params.id)

  if (isNaN(vagaId)) {
    return <div>Vaga não encontrada.</div>
  }

  const vaga = await prisma.vaga.findUnique({
    where: { idVaga: vagaId },
    select: { status: true },
  });

  if (!vaga) {
    return <div>Vaga não encontrada.</div>
  }

  if (vaga.status === 'Encerrada') {
    return <VagaEncerrada />;
  }

  // --- ALTERAÇÃO AQUI ---
  // Envolvemos o formulário em um elemento 'main' com a cor de fundo padrão do sistema.
  return (
    <main className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <FormCandidatoPublico vagaId={vagaId} />
    </main>
  );
}