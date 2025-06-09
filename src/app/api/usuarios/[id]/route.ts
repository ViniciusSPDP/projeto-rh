// src/app/api/usuarios/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Função para atualizar um usuário (status ou senha)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = Number(params.id);
    const body = await req.json();
    const { autorizado, senha } = body;

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'ID de usuário inválido' }, { status: 400 });
    }

    const updateData: { autorizado?: boolean; senhahash?: string } = {};

    // Verifica se a propriedade 'autorizado' foi enviada e é um booleano
    if (typeof autorizado === 'boolean') {
      updateData.autorizado = autorizado;
    }

    // Verifica se a 'senha' foi enviada, criptografa e adiciona aos dados de atualização
    if (senha && typeof senha === 'string') {
      if (senha.length < 6) {
        return NextResponse.json({ error: 'A nova senha deve ter pelo menos 6 caracteres.' }, { status: 400 });
      }
      updateData.senhahash = await bcrypt.hash(senha, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Nenhum dado para atualizar fornecido.' }, { status: 400 });
    }

    // Executa a atualização no banco de dados
    const updatedUser = await prisma.usuario.update({
      where: { id: userId },
      data: updateData,
    });

    // Remove a senha do objeto de retorno por segurança
    const { senhahash: _, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);

  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}