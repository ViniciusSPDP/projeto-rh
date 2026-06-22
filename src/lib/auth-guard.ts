// src/lib/auth-guard.ts
//
// Guard de sessão para rotas /api. O middleware NÃO cobre /api (ver src/middleware.ts),
// então rotas administrativas/sensíveis precisam validar a sessão internamente.
//
// Uso:
//   const session = await requireSession();
//   if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function requireSession() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ? session : null;
}
