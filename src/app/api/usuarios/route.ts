// src/app/api/usuarios/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth-guard';
import prisma from '@/lib/prisma'
import { uploadBase64Image } from '@/lib/minio'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const body = await req.json()
    const { nome, email, senha, autorizado, fotourl } = body

    // 1. Validação dos dados de entrada
    if (!nome || !email || !senha) {
      return NextResponse.json(
        { error: 'Nome, e-mail e senha são obrigatórios.' },
        { status: 400 }
      )
    }

    // 2. Verifica se o e-mail já existe
    const emailExistente = await prisma.usuario.findUnique({
      where: { email },
    })

    if (emailExistente) {
      return NextResponse.json(
        { error: 'Este e-mail já está em uso.' },
        { status: 409 } // 409 Conflict
      )
    }

    // 3. Criptografa a senha antes de salvar
    const senhahash = await bcrypt.hash(senha, 10)

    // 4. Foto: se vier base64/data URL, sobe pro MinIO e guarda só a KEY
    const fotoKey = await uploadBase64Image(fotourl, 'fotos/usuarios')

    // 5. Cria o novo usuário no banco de dados
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhahash,
        autorizado: autorizado || false, // Garante que o padrão seja false
        fotourl: fotoKey,
      },
    })

    // Remove a senha do objeto de retorno por segurança
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { senhahash: _, ...usuarioSemSenha } = novoUsuario

    return NextResponse.json(usuarioSemSenha, { status: 201 }) // 201 Created
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    )
  }
}
