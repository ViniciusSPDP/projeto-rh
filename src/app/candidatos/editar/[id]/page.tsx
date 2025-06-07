import { notFound, redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import FormEditarCandidato from '@/app/components/FormEditarCandidato'

export default async function EditarCandidatoPage({
  params,
}: {
  params: { id: string }
}) {
  const id = Number(params.id)
  if (isNaN(id)) return notFound()

  const candidato = await prisma.candidatos.findUnique({
    where: { idCandidato: id },
  })

  if (!candidato) return notFound()

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 p-6">      <FormEditarCandidato candidato={candidato} />
    </div>
  )
}
