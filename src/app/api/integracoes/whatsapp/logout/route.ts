// app/api/integracoes/whatsapp/logout/route.ts

import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth-guard';
import { evolutionFetch, EVOLUTION_API } from '@/lib/evolution-api'

export async function POST() {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    // Fazer logout da instância
    await evolutionFetch(
      `/instance/logout/${EVOLUTION_API.instanceName}`,
      {
        method: 'DELETE',
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao desconectar:', error)
    return NextResponse.json(
      { error: 'Erro ao desconectar WhatsApp' },
      { status: 500 }
    )
  }
}