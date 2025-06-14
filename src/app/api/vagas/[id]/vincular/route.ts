import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Interface para o contexto da rota
interface Context {
  params: {
    id: string;
  }
}

// Interface para o corpo da requisição
interface RequestBody {
  candidatos: number[];
}

export async function POST(req: NextRequest, context: Context) {
  try {
    const vagaId = Number(context.params.id)
    const { candidatos }: RequestBody = await req.json()

    if (isNaN(vagaId) || !Array.isArray(candidatos) || candidatos.length === 0) {
      return NextResponse.json({ error: 'Dados inválidos fornecidos.' }, { status: 400 })
    }
    
    // Usando uma transação para garantir a atomicidade das operações
    await prisma.$transaction(async (tx) => {
      for (const candidatoId of candidatos) {
        // Cria o vínculo entre vaga e candidato
        await tx.vagaCandidato.create({
          data: {
            vagaId,
            candidatoId,
            etapa: 'Em processo',
          },
        })

        // Atualiza o status do candidato
        await tx.candidatos.update({
          where: { idCandidato: candidatoId },
          data: { situacaoCandidato: 'Em processo' },
        })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao vincular candidatos à vaga:", error);
    return NextResponse.json({ error: 'Erro interno do servidor ao vincular candidatos.' }, { status: 500 });
  }
}
