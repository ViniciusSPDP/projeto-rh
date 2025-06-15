import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Definindo a interface para o contexto da rota
interface Context {
  params: {
    id: string;
  };
}

export async function PATCH(req: NextRequest, context: Context) {
  const vagaId = Number(context.params.id);

  if (isNaN(vagaId)) {
    return NextResponse.json({ error: 'ID da vaga inválido' }, { status: 400 });
  }

  try {
    const vagaAtualizada = await prisma.$transaction(async (tx) => {
      const candidatosDaVaga = await tx.vagaCandidato.findMany({
        where: {
          vagaId: vagaId,
        },
      });

      for (const vagaCandidato of candidatosDaVaga) {
        const novaSituacao =
          vagaCandidato.etapa === 'Contratado' ? 'Contratado' : 'Reprovado';

        // CORREÇÃO AQUI: Alterado de 'candidato' para 'candidatos'
        await tx.candidatos.update({ 
          where: {
            idCandidato: vagaCandidato.candidatoId,
          },
          data: {
            situacaoCandidato: novaSituacao,
          },
        });
      }

      const vaga = await tx.vaga.update({
        where: {
          idVaga: vagaId,
        },
        data: {
          status: 'Encerrada',
        },
      });
      
      return vaga;
    });

    return NextResponse.json(vagaAtualizada);

  } catch (error) {
    console.error('Erro ao encerrar vaga:', error);
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Vaga não encontrada' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor ao tentar encerrar a vaga.' },
      { status: 500 }
    );
  }
}