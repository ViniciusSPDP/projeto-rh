// src/app/api/candidatos-disponiveis/route.ts

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const vagaId = Number(searchParams.get('vagaId'))
  const page = Number(searchParams.get('page') || '1')
  const search = searchParams.get('search') || ''

  // Lendo os novos parâmetros de filtro da URL
  const vagaInteresse = searchParams.get('vaga_interesse') || ''
  const situacao = searchParams.get('situacao') || ''
  
  const itemsPerPage = 10

  if (isNaN(vagaId)) {
    return NextResponse.json({ error: 'ID da vaga inválido' }, { status: 400 })
  }

  try {
    const candidatosVinculados = await prisma.vagaCandidato.findMany({
      where: { vagaId },
      select: { candidatoId: true },
    })
    const idsVinculados = candidatosVinculados.map((vc) => vc.candidatoId)

    // Construindo a cláusula 'where' com todos os filtros
    const where: Prisma.CandidatosWhereInput = {
      idCandidato: {
        notIn: idsVinculados,
      },
    }

    if (search) {
      where.OR = [
        { nomeCandidato: { contains: search, mode: 'insensitive' } },
        { emailCandidato: { contains: search, mode: 'insensitive' } },
        { cpfCandidato: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    // Adiciona o filtro de vaga de interesse, se existir
    if (vagaInteresse) {
      where.vagainteresseCandidato = vagaInteresse;
    }

    // Adiciona o filtro de situação do candidato, se existir
    if (situacao) {
      where.situacaoCandidato = situacao;
    }

    const candidatos = await prisma.candidatos.findMany({
      where, // A cláusula 'where' com os novos filtros é usada aqui
      take: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
      orderBy: { nomeCandidato: 'asc' },
    })

    return NextResponse.json(candidatos)
  } catch (error) {
    console.error('Erro ao buscar candidatos disponíveis:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}