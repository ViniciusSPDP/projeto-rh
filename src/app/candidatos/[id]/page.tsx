import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import DetalhesCandidato from '@/app/components/DetalhesCandidato'
import DetalhesCandidatoComCurriculo from '@/app/components/DetalhesCandidatoComCurriculo'

export default async function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (isNaN(id)) return notFound()

  const candidato = await prisma.candidatos.findUnique({
    where: { idCandidato: id },
  })

  if (!candidato) return notFound()

  // Verifica se o candidato tem curriculoUrl preenchido
  const temCurriculo = candidato.curriculoUrl && candidato.curriculoUrl.trim() !== ''

  // Renderiza o componente apropriado baseado na presença do currículo
  if (temCurriculo) {
    return <DetalhesCandidatoComCurriculo candidato={candidato} />
  } else {
    return <DetalhesCandidato candidato={candidato} />
  }
}