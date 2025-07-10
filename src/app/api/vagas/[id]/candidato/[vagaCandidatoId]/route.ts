import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

interface Context {
  params: {
    id: string
    vagaCandidatoId: string
  }
}

export async function DELETE(_req: Request, context: Context) {
  const vagaId = Number(context.params.id)
  const vagaCandidatoId = Number(context.params.vagaCandidatoId)

  if (isNaN(vagaId) || isNaN(vagaCandidatoId)) {
    return NextResponse.json({ error: 'IDs inválidos' }, { status: 400 })
  }

  try {
    const registro = await prisma.vagaCandidato.findUnique({ where: { id: vagaCandidatoId } })
    if (!registro || registro.vagaId !== vagaId) {
      return NextResponse.json({ error: 'Vínculo não encontrado' }, { status: 404 })
    }

    await prisma.vagaCandidato.delete({ where: { id: vagaCandidatoId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao remover candidato da vaga:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}