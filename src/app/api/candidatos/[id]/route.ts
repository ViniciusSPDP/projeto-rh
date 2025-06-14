import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Corrigido a tipagem do 'context'
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)
  
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    const data = await request.json()

    // Converte as datas de string para o formato Date, se existirem
    const parsedData = {
      ...data,
      datanascimentoCandidato: data.datanascimentoCandidato ? new Date(data.datanascimentoCandidato) : null,
      datainicioCandidato: data.datainicioCandidato ? new Date(data.datainicioCandidato) : null,
      datafinalCandidato: data.datafinalCandidato ? new Date(data.datafinalCandidato) : null,
      datainicio2Candidato: data.datainicio2Candidato ? new Date(data.datainicio2Candidato) : null,
      datafinal2Candidato: data.datafinal2Candidato ? new Date(data.datafinal2Candidato) : null,
      datainicio3Candidato: data.datainicio3Candidato ? new Date(data.datainicio3Candidato) : null,
      datafinal3Candidato: data.datafinal3Candidato ? new Date(data.datafinal3Candidato) : null,
    }

    const candidato = await prisma.candidatos.update({
      where: { idCandidato: id },
      data: parsedData,
    })

    // Retorna o candidato atualizado
    return NextResponse.json(candidato, { status: 200 })

  } catch (error) {
    console.error('Erro ao atualizar candidato:', error)
    return NextResponse.json(
      { error: 'Erro interno ao atualizar candidato' },
      { status: 500 }
    )
  }
}