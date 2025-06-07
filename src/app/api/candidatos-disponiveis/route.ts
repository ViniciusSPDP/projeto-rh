import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const vagaId = Number(url.searchParams.get('vagaId'))
  const page = Number(url.searchParams.get('page') || '1')
  const search = url.searchParams.get('search') || ''
  const take = 10
  const skip = (page - 1) * take

  // IDs de candidatos já vinculados à vaga
  const vinculados = await prisma.vagaCandidato.findMany({
    where: { vagaId },
    select: { candidatoId: true },
  })

  const idsVinculados = vinculados.map((v) => v.candidatoId)

  // Filtro por nome ou email
  const filter = search
    ? {
        AND: [
          {
            OR: [
              { nomeCandidato: { contains: search, mode: 'insensitive' } },
              { emailCandidato: { contains: search, mode: 'insensitive' } },
            ],
          },
          { idCandidato: { notIn: idsVinculados } },
          { situacaoCandidato: { not: 'Em processo' } },
        ],
      }
    : {
        idCandidato: { notIn: idsVinculados },
        situacaoCandidato: { not: 'Em processo' },
      }

  const candidatos = await prisma.candidatos.findMany({
    where: filter,
    orderBy: { created_at: 'desc' },
    take,
    skip,
  })

  // Serializa BigInt para evitar erro
  const candidatosSerializados = candidatos.map((c) => ({
    ...c,
    idCandidato: Number(c.idCandidato),
  }))

  return NextResponse.json(candidatosSerializados)
}
