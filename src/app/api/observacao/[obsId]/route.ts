// app/api/candidatos/observacao/[obsId]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// PATCH - Editar observação específica
export async function PATCH(
  request: NextRequest,
  { params }: { params: { obsId: string } }
) {
  try {
    const { observacao, updatedBy } = await request.json()
    const obsId = parseInt(params.obsId)

    const observacaoAtualizada = await prisma.observacaoHistorico.update({
      where: { id: obsId },
      data: {
        observacao,
        updatedBy: updatedBy || 'Usuário',
        updatedAt: new Date()
      }
    })

    return NextResponse.json(observacaoAtualizada)
  } catch (error) {
    console.error('Erro ao atualizar observação:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar observação' },
      { status: 500 }
    )
  }
}

// DELETE - Soft delete da observação
export async function DELETE(
  request: NextRequest,
  { params }: { params: { obsId: string } }
) {
  try {
    const obsId = parseInt(params.obsId);

    const observacaoDeletada = await prisma.observacaoHistorico.update({
      where: { id: obsId },
      data: {
        isDeleted: true,
        updatedAt: new Date(),
      },
    });

    // Use a variável no retorno
    return NextResponse.json(observacaoDeletada);

  } catch (error) {
    console.error('Erro ao deletar observação:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar observação' },
      { status: 500 }
    );
  }
}

