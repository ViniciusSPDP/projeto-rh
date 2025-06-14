// src/app/perfil/usuarios/page.tsx

import prisma from '@/lib/prisma';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';
import UserListClient from './UserListClient'; // Nosso componente interativo

export const dynamic = 'force-dynamic'


// Tipagem para os dados que passaremos para o componente cliente
export type UserForList = {
  id: number;
  nome: string;
  email: string;
  fotourl: string | null;
  autorizado: boolean | null;
}

// Função para buscar os usuários no servidor
async function getUsers(): Promise<UserForList[]> {
  const users = await prisma.usuario.findMany({
    orderBy: { nome: 'asc' },
    select: {
      id: true,
      nome: true,
      email: true,
      fotourl: true,
      autorizado: true,
    }
  });
  // O Prisma retorna id como BigInt, precisamos converter para número
  return users.map(user => ({ ...user, id: Number(user.id) }));
}

export default async function GerenciarUsuariosPage() {
  const users = await getUsers();

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <header className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between mb-6 pb-4 border-b border-gray-200">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Gerenciar Usuários</h1>
                <p className="text-sm text-gray-500 mt-1">Adicione, autorize e gerencie os usuários do sistema.</p>
            </div>
            <Link
                href="/perfil/usuarios/novo" // Link para a página de criação que você já tem
                className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
            >
                <UserPlus size={18} />
                <span>Novo Usuário</span>
            </Link>
        </header>
        
        {/* Renderiza o componente de cliente com os dados iniciais */}
        <UserListClient initialUsers={users} />
    </div>
  );
}