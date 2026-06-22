// src/app/api/candidatos/[id]/observacao/historico/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth-guard';
import prisma from '@/lib/prisma'

// Interface para os parâmetros da rota no Next.js 15
interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST - Adicionar nova observação ao histórico
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    // CORREÇÃO NEXT.JS 15: Aguardar params
    const resolvedParams = await params
    const candidatoId = BigInt(resolvedParams.id)
    
    const { observacao, createdBy } = await request.json()

    const novaObservacao = await prisma.observacaoHistorico.create({
      data: {
        candidatoId,
        observacao,
        createdBy: createdBy || 'Usuário' // Aqui você pode pegar do contexto de auth
      }
    })

    // Serialização: Converter BigInt para String para não quebrar o JSON
    const observacaoFormatada = {
      ...novaObservacao,
      candidatoId: novaObservacao.candidatoId.toString(),
      id: novaObservacao.id.toString() // Converte ID da observação se for BigInt/Int
    }

    return NextResponse.json(observacaoFormatada)
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
  { params }: RouteParams
) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    // CORREÇÃO NEXT.JS 15: Aguardar params
    const resolvedParams = await params
    const candidatoId = BigInt(resolvedParams.id)

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