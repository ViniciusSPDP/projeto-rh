import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { uploadBase64Image } from '@/lib/minio'

export async function POST(req: Request) {
  const data = await req.json()

  const parseDate = (value: string) => {
    return value && value.trim() !== '' ? new Date(value) : null
  }

  try {
    // Remover vagaId antes de criar o candidato
    const { vagaId, ...dadosCandidato } = data

    // Foto: se vier base64/data URL, sobe pro MinIO e guarda só a KEY
    const fotoCandidato = await uploadBase64Image(dadosCandidato.fotoCandidato, 'fotos/candidatos')

    const candidato = await prisma.candidatos.create({
      data: {
        ...dadosCandidato,
        fotoCandidato,
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
