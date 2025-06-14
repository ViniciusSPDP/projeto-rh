import { notFound } from 'next/navigation' // 'redirect' foi removido daqui
import prisma from '@/lib/prisma'
import FormEditarCandidato from '@/app/components/FormEditarCandidato'
import { Candidatos } from '@prisma/client' // Importando o tipo para melhor tipagem

// Definindo o tipo das props para o componente
interface EditarCandidatoPageProps {
  params: {
    id: string
  }
}

export default async function EditarCandidatoPage({ params }: EditarCandidatoPageProps) {
  const id = Number(params.id)
  if (isNaN(id)) {
    return notFound()
  }

  const candidato: Candidatos | null = await prisma.candidatos.findUnique({
    where: { idCandidato: id },
  })

  if (!candidato) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 p-6">
      <FormEditarCandidato candidato={candidato} />
    </div>
  )
}
