import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Definindo a interface para o contexto da rota
interface Context {
  params: {
    id: string;
  }
}

export async function PATCH(
  req: NextRequest,
  context: Context // Corrigido o tipo 'any'
) {
  const vagaId = Number(context.params.id)

  if (isNaN(vagaId)) {
    return NextResponse.json({ error: 'ID da vaga inválido' }, { status: 400 })
  }

  try {
    const vaga = await prisma.vaga.findUnique({
      where: { idVaga: vagaId },
    })

    if (!vaga) {
      return NextResponse.json({ error: 'Vaga não encontrada' }, { status: 404 })
    }

    const vagaAtualizada = await prisma.vaga.update({
      where: { idVaga: vagaId },
      data: { status: 'Encerrada' },
    })

    return NextResponse.json(vagaAtualizada)
  } catch (error) {
    console.error('Erro ao encerrar vaga:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
