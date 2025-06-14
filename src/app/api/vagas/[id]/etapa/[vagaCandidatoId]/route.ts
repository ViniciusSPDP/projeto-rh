import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Definindo a interface para o contexto da rota
interface Context {
  params: {
    id: string; // Embora não usado, é bom mantê-lo na definição do tipo para clareza
    vagaCandidatoId: string;
  }
}

export async function PATCH(
  req: NextRequest,
  context: Context // Corrigido o tipo 'any'
) {
  // Removido 'id' da desestruturação pois não estava sendo usado
  const { vagaCandidatoId } = context.params
  const etapa = (await req.json()).etapa

  const vagaCandidatoIdNum = Number(vagaCandidatoId)

  if (!etapa || isNaN(vagaCandidatoIdNum)) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  try {
    const atualizado = await prisma.vagaCandidato.update({
      where: { id: vagaCandidatoIdNum },
      data: { etapa },
    })

    return NextResponse.json({
      ...atualizado,
      vagaId: Number(atualizado.vagaId),
      candidatoId: Number(atualizado.candidatoId),
    })
  } catch (error) {
    console.error("Erro ao atualizar etapa do candidato:", error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
