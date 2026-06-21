import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { uploadBase64Image } from '@/lib/minio'

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

    // Foto: se vier base64/data URL nova, sobe pro MinIO e guarda só a KEY.
    // Se já for uma KEY (foto inalterada) ou URL, o helper mantém o valor.
    const fotoCandidato =
      data.fotoCandidato !== undefined
        ? await uploadBase64Image(data.fotoCandidato, 'fotos/candidatos')
        : undefined

    // Converte as datas de string para o formato Date, se existirem
    const parsedData = {
      ...data,
      ...(fotoCandidato !== undefined ? { fotoCandidato } : {}),
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const idStr = await Promise.resolve(params.id)
  const id = Number(idStr)
  
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    // Para deletar o candidato de forma segura, precisamos usar uma Transaction
    // para excluir todas as dependências relacionadas primeiro, já que 
    // VagaCandidato não possui onDelete: Cascade por padrão no banco do usuário.
    await prisma.$transaction([
      // 1. Apaga os vínculos com as vagas
      prisma.vagaCandidato.deleteMany({
        where: { candidatoId: id },
      }),
      // 2. Apaga o histórico de observações (se existir)
      prisma.observacaoHistorico.deleteMany({
        where: { candidatoId: id },
      }),
      // 3. Finalmente apaga o candidato
      prisma.candidatos.delete({
        where: { idCandidato: id },
      }),
    ])

    return NextResponse.json({ success: true, message: 'Candidato excluído com sucesso' }, { status: 200 })

  } catch (error) {
    console.error('Erro ao excluir candidato:', error)
    return NextResponse.json(
      { error: 'Erro interno ao excluir candidato.' },
      { status: 500 }
    )
  }
}