import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import FormCandidatoPublico from '@/app/components/FormCandidatoPublico'
import { AlertCircle } from 'lucide-react'

// A página agora é um componente 'async', o que é a prática recomendada.
export default async function FormularioDaVagaPage({ params }: { params: { id: string } }) {
  const vagaId = Number(params.id)

  if (isNaN(vagaId)) {
    return notFound();
  }

  // Busca os detalhes da vaga no servidor antes de renderizar a página.
  const vaga = await prisma.vaga.findUnique({
    where: { idVaga: vagaId },
    select: {
      titulo: true,
      status: true,
    }
  });

  // Se a vaga não for encontrada ou já estiver fechada, exibe uma mensagem amigável.
  if (!vaga || vaga.status !== 'Aberta') {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="text-center bg-white p-10 rounded-lg shadow-md">
                <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                <h1 className="mt-4 text-2xl font-bold text-red-600">Vaga Indisponível</h1>
                <p className="text-gray-600 mt-2">Esta vaga não foi encontrada ou não está mais aceitando candidaturas.</p>
            </div>
        </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
        {/* Passamos o título da vaga para o formulário, melhorando a UX */}
        <FormCandidatoPublico vagaId={vagaId} vagaTitulo={vaga.titulo} />
    </main>
  )
}
