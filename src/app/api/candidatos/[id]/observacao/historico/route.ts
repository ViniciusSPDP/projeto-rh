// app/api/candidatos/[id]/observacao/historico/route.ts

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST - Adicionar nova observação ao histórico
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { observacao, createdBy } = await request.json()
    const candidatoId = BigInt(params.id)

    const novaObservacao = await prisma.observacaoHistorico.create({
      data: {
        candidatoId,
        observacao,
        createdBy: createdBy || 'Usuário' // Aqui você pode pegar do contexto de auth
      }
    })

    return NextResponse.json(novaObservacao)
  } catch (error) {
    console.error('Erro ao adicionar observação:', error)
    return NextResponse.json(
      { error: 'Erro ao adicionar observação' },
      { status: 500 }
    )
  }
}

// GET - Buscar histórico de observações
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const candidatoId = BigInt(params.id)

    const historico = await prisma.observacaoHistorico.findMany({
      where: { 
        candidatoId,
        isDeleted: false // Não mostra observações deletadas
      },
      orderBy: { createdAt: 'desc' }
    })

    // Converte BigInt para string no JSON
    const historicoFormatado = historico.map(obs => ({
      ...obs,
      candidatoId: obs.candidatoId.toString(),
      id: obs.id.toString()
    }))

    return NextResponse.json(historicoFormatado)
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar histórico' },
      { status: 500 }
    )
  }
}