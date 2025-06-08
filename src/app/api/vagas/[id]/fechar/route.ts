// src/app/api/vagas/[id]/fechar/route.ts

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Usamos o método PATCH para atualizações parciais
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const vagaId = Number(params.id)

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

    // Atualiza o status da vaga para "Encerrada"
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