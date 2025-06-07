// /src/app/api/vagas/[id]/fechar/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const vagaId = Number(params.id)

  // Pega todos os vínculos dessa vaga
  const vinculados = await prisma.vagaCandidato.findMany({
    where: { vagaId },
    include: { candidato: true },
  })

  // Atualiza situaçãoCandidato de acordo com etapa
  const atualizacoes = vinculados.map((vc) =>
    prisma.candidatos.update({
      where: { idCandidato: vc.candidatoId },
      data: {
        situacaoCandidato: vc.etapa === 'Contratado' ? 'Contratado' : 'Reprovado',
      },
    })
  )

  // Executa atualizações + fecha a vaga
  await prisma.$transaction([
    ...atualizacoes,
    prisma.vaga.update({
      where: { idVaga: vagaId },
      data: { status: 'Encerrada' },
    }),
  ])

  return NextResponse.json({ status: 'ok' })
}
