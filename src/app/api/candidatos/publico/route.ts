import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  const data = await req.json()

  const parseDate = (value: string) => {
    return value && value.trim() !== '' ? new Date(value) : null
  }

  try {
    // Remover vagaId antes de criar o candidato
    const { vagaId, ...dadosCandidato } = data

    const candidato = await prisma.candidatos.create({
      data: {
        ...dadosCandidato,
        datanascimentoCandidato: parseDate(data.datanascimentoCandidato),
        datainicioCandidato: parseDate(data.datainicioCandidato),
        datafinalCandidato: parseDate(data.datafinalCandidato),
        datainicio2Candidato: parseDate(data.datainicio2Candidato),
        datafinal2Candidato: parseDate(data.datafinal2Candidato),
        datainicio3Candidato: parseDate(data.datainicio3Candidato),
        datafinal3Candidato: parseDate(data.datafinal3Candidato),
        conhecimentosinformaticaCandidato: data.conhecimentosinformaticaCandidato || '',
      },
    })

    // Vincula à vaga (tabela intermediária)
    if (vagaId) {
      await prisma.vagaCandidato.create({
        data: {
          vagaId: vagaId,
          candidatoId: candidato.idCandidato,
          etapa: 'Em processo',
        },
      })
    }

    return NextResponse.json({
      ...candidato,
      idCandidato: candidato.idCandidato.toString()
    })

  } catch (error) {
    console.error('Erro ao criar candidato:', error)
    return new NextResponse('Erro ao criar candidato.', { status: 500 })
  }
}
