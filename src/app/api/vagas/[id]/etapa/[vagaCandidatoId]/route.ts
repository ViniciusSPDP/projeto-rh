import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; vagaCandidatoId: string } }
) {
  const vagaCandidatoId = Number(params.vagaCandidatoId)
  const etapa = (await req.json()).etapa

  if (!etapa || isNaN(vagaCandidatoId)) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const atualizado = await prisma.vagaCandidato.update({
    where: { id: vagaCandidatoId },
    data: { etapa },
  })

  return NextResponse.json({
    ...atualizado,
    vagaId: Number(atualizado.vagaId),
    candidatoId: Number(atualizado.candidatoId),
  })
}
