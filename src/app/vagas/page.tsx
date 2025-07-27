// ARQUIVO ATUALIZADO: src/app/vagas/page.tsx

import prisma from '@/lib/prisma';
import { BotaoCriarVaga } from '@/app/components/VagasActions';
import VagasList from '@/app/components/VagasList'; // Importando o novo componente de cliente

export const dynamic = 'force-dynamic';

// A busca de dados acontece aqui, no servidor
async function getVagas() {
  const vagas = await prisma.vaga.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      _count: {
        select: { candidatos: true },
      },
    },
  });
  return vagas;
}

// Este é o seu Componente de Servidor. Ele é 'async'.
export default async function ListagemVagasPage() {
  // 1. Busca os dados
  const vagas = await getVagas();

  // 2. Renderiza a estrutura da página e passa os dados para o Componente de Cliente
  return (
    <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between mb-10 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Painel de Vagas</h1>
          <p className="mt-1 text-md text-gray-500">Gerencie suas oportunidades e acompanhe os processos seletivos.</p>
        </div>
        {vagas.length > 0 && (
          <BotaoCriarVaga />
        )}
      </header>

      {/* Passa as vagas para o componente de cliente, que cuidará da interatividade */}
      <VagasList vagas={vagas} />
    </main>
  );
}