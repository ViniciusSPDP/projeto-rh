import prisma from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  const data = await req.json()

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

  if (isNaN(id)) {
    return new Response('ID inválido', { status: 400 })
  }

  try {
    const candidato = await prisma.candidatos.update({
      where: { idCandidato: id },
      data: parsedData,
    })

    return new Response(
      JSON.stringify({
        ...candidato,
        idCandidato: candidato.idCandidato.toString(), // 👈 converte
      }),
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Erro ao atualizar candidato:', error)
    return new Response('Erro ao atualizar candidato', { status: 500 })
  }
}
