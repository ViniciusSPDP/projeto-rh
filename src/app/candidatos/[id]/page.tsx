import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import DetalhesCandidato from '@/app/components/DetalhesCandidato'

export default async function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (isNaN(id)) return notFound()

  const candidato = await prisma.candidatos.findUnique({
    where: { idCandidato: id },
  })

  if (!candidato) return notFound()

  return <DetalhesCandidato candidato={candidato} />
}
