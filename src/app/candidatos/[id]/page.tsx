// src/app/candidatos/[id]/page.tsx

import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
// Importamos o tipo original do Prisma para fazer o cast
import { Candidatos } from '@prisma/client' 
import DetalhesCandidato from '@/app/components/DetalhesCandidato'
import DetalhesCandidatoComCurriculo from '@/app/components/DetalhesCandidatoComCurriculo'

// 1. Atualize a tipagem para Promise (Next.js 15)
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  
  // 2. Aguarde o params ser resolvido
  const resolvedParams = await params
  const id = Number(resolvedParams.id)

  if (isNaN(id)) return notFound()

  // 3. Busque usando BigInt (garante compatibilidade com o Prisma)
  const candidato = await prisma.candidatos.findUnique({
    where: { idCandidato: BigInt(id) },
  })

  if (!candidato) return notFound()

  // 4. SERIALIZAÇÃO OBRIGATÓRIA: 
  // O Next.js não permite passar BigInt do Server para o Client Component.
  // Criamos um novo objeto convertendo o ID para string.
  const candidatoSerializado = {
    ...candidato,
    idCandidato: candidato.idCandidato.toString(),
    // Se tiver outros campos BigInt ou datas problemáticas, trate aqui também
  }

  // Verifica se o candidato tem curriculoUrl preenchido
  const temCurriculo = candidato.curriculoUrl && candidato.curriculoUrl.trim() !== ''

  // 5. Renderiza o componente apropriado
  // CORREÇÃO: Usamos 'as unknown as Candidatos' em vez de 'as any'.
  // Isso engana o compilador de forma segura sem disparar o erro do ESLint.
  if (temCurriculo) {
    return <DetalhesCandidatoComCurriculo candidato={candidatoSerializado as unknown as Candidatos} />
  } else {
    return <DetalhesCandidato candidato={candidatoSerializado as unknown as Candidatos} />
  }
}