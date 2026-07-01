// src/lib/auth-guard.ts
//
// Guard de sessão para rotas /api. O middleware NÃO cobre /api (ver src/middleware.ts),
// então rotas administrativas/sensíveis precisam validar a sessão internamente.
//
// Uso:
//   const session = await requireSession();
//   if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
//
//   const session = await requireAdmin();
//   if (!session) return NextResponse.json({ error: 'Acesso restrito a administradores' }, { status: 403 });

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function requireSession() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ? session : null;
}

// Retorna a sessão apenas se o usuário for ADMIN; senão null (o caller responde 403).
// Colapsa "não logado" e "logado sem permissão" em null de propósito — para uma rota
// administrativa, ambos devem ser barrados (403 é aceitável para os dois).
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  if (session.user.role !== 'ADMIN') return null;
  return session;
}
