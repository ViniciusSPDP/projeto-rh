import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { uploadBase64Image } from '@/lib/minio'
import { candidatoCreateSchema } from '@/lib/validation/candidato'

export async function POST(req: Request) {
  try {
    const data = await req.json()

    // Consentimento LGPD obrigatório (validado no backend) — lido do body cru.
    if (data?.consentimento !== true) {
      return NextResponse.json(
        { error: 'É necessário aceitar a Política de Privacidade para enviar a candidatura.' },
        { status: 400 },
      )
    }

    // Whitelist Zod: strip remove vagaId/consentimento e qualquer campo desconhecido
    // (anti mass-assignment). As datas já são coeridas pelo schema.
    const parsed = candidatoCreateSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }
    const dados = parsed.data

    // Foto: se vier base64/data URL, sobe pro MinIO e guarda só a KEY.
    const fotoCandidato = await uploadBase64Image(dados.fotoCandidato, 'fotos/candidatos')

    const candidato = await prisma.candidatos.create({
      data: {
        ...dados,
        fotoCandidato,
        conhecimentosinformaticaCandidato: dados.conhecimentosinformaticaCandidato ?? '',
      },
    })

    // Vincula à vaga (tabela intermediária). vagaId vem do body cru (foi removido pelo strip).
    if (data.vagaId) {
      await prisma.vagaCandidato.create({
        data: {
          vagaId: data.vagaId,
          candidatoId: candidato.idCandidato,
          etapa: 'Em processo',
        },
      })
    }

    return NextResponse.json({
      ...candidato,
      idCandidato: candidato.idCandidato.toString(),
    })
  } catch (error) {
    console.error('Erro ao criar candidato:', error)
    return new NextResponse('Erro ao criar candidato.', { status: 500 })
  }
}
