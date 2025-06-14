import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Definindo uma interface para o contexto da rota
interface Context {
  params: {
    id: string
  }
}

export async function PATCH(
  req: NextRequest,
  context: Context // 👈 CORREÇÃO 1: Tipagem do context
) {
  const { params } = context
  const userId = Number(params.id);
  const body = await req.json();
  const { autorizado, senha } = body;

  if (isNaN(userId)) {
    return NextResponse.json({ error: 'ID de usuário inválido' }, { status: 400 });
  }

  const updateData: { autorizado?: boolean; senhahash?: string } = {};

  if (typeof autorizado === 'boolean') {
    updateData.autorizado = autorizado;
  }

  if (senha && typeof senha === 'string') {
    if (senha.length < 6) {
      return NextResponse.json({ error: 'A nova senha deve ter pelo menos 6 caracteres.' }, { status: 400 });
    }
    updateData.senhahash = await bcrypt.hash(senha, 10);
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'Nenhum dado para atualizar fornecido.' }, { status: 400 });
  }

  try {
    const updatedUser = await prisma.usuario.update({
      where: { id: userId },
      data: updateData,
    });

    // 👇 CORREÇÃO 2: Adicionado comentário para desabilitar a regra do ESLint nesta linha
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senhahash: _, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);

  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
