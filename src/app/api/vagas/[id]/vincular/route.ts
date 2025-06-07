// /app/api/vagas/[id]/vincular/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const vagaId = Number(params.id)
  const { candidatos } = await req.json()

  for (const candidatoId of candidatos) {
    await prisma.vagaCandidato.create({
      data: {
        vagaId,
        candidatoId,
        etapa: 'Em processo',
      },
    })

    await prisma.candidatos.update({
      where: { idCandidato: candidatoId },
      data: { situacaoCandidato: 'Em processo' },
    })
  }

  return NextResponse.json({ success: true })
}
