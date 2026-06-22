// app/api/candidatos/[id]/observacao/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth-guard';
import prisma  from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const { observacao } = await request.json()
    const id = parseInt(params.id)

    const candidato = await prisma.candidatos.update({
      where: { idCandidato: id },
      data: {
        observacaoCandidato: observacao,
        observacaoUpdatedAt: new Date() // Atualiza a data sempre que a observação mudar
      }
    })

    return NextResponse.json(candidato)
  } catch (error) {
    console.error('Erro ao atualizar observação:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar observação' },
      { status: 500 }
    )
  }
}