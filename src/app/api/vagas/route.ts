import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth-guard';
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const data = await req.json()

  if (!data.titulo) {
    return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 })
  }

  const vaga = await prisma.vaga.create({
    data: {
      titulo: data.titulo,
      descricao: data.descricao,
    },
  })

  return NextResponse.json(vaga)
}
