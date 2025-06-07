import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { status } = await req.json()

  if (!status || !['Aprovado', 'Reprovado'].includes(status)) {
    return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
  }

  const id = Number(params.id)

  try {
    await prisma.candidatos.update({
      where: { idCandidato: id },
      data: { situacaoCandidato: status },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar status' }, { status: 500 })
  }
}
