import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth-guard';
import prisma from '@/lib/prisma'

// Definindo uma interface para o contexto da rota
interface Context {
  params: {
    id: string
  }
}

export async function PATCH(req: Request, context: Context) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const { status } = await req.json()
  const { params } = context

  if (!status || !['Aprovado', 'Reprovado'].includes(status)) {
    return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
  }

  const id = Number(params.id)

  try {
    await prisma.candidatos.update({
      where: { idCandidato: id },
      data: { situacaoCandidato: status },
    })

    return NextResponse.json({ success: true })
  } catch (error) { 
    return NextResponse.json({ error: 'Erro ao atualizar status' + error }, { status: 500 })
  }
}
