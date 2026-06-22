import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth-guard';
import prisma from '@/lib/prisma'

interface Context {
  params: { id: string }
}

export async function PATCH(req: NextRequest, context: Context) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const vagaId = Number(context.params.id)
  if (isNaN(vagaId)) {
    return NextResponse.json({ error: 'ID da vaga inválido' }, { status: 400 })
  }

  const data = await req.json().catch(() => ({}))
  try {
    const vaga = await prisma.vaga.update({
      where: { idVaga: vagaId },
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
      },
    })
    return NextResponse.json(vaga)
  } catch (error) {
    console.error('Erro ao atualizar vaga:', error)
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Vaga não encontrada' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const vagaId = Number(context.params.id)
  if (isNaN(vagaId)) {
    return NextResponse.json({ error: 'ID da vaga inválido' }, { status: 400 })
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.vagaCandidato.deleteMany({ where: { vagaId } })
      await tx.vaga.delete({ where: { idVaga: vagaId } })
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir vaga:', error)
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json({ error: 'Vaga não encontrada' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}