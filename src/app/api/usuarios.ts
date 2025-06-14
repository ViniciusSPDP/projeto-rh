// src/pages/api/usuarios.ts (exemplo com Next.js API Route)
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { Prisma } from '@prisma/client' // Importando tipos do Prisma

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { nome, email, senha } = req.body as { nome: string; email: string; senha: string }

  // 1) Validação básica
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'nome, email e senha são obrigatórios' })
  }

  // 2) Criptografa a senha
  const senhahash = await hashPassword(senha)

  // 3) Salva no banco
  try {
    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhahash,
        autorizado: true,      // ou false, conforme seu fluxo
        fotourl: null,
      },
    })
    return res.status(201).json({ id: usuario.id, email: usuario.email })
  } catch (e) { // Removido o 'any'
    // Verificando se é um erro conhecido do Prisma com código de erro
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return res.status(409).json({ error: 'Email já cadastrado' })
    }
    // Para todos os outros erros
    return res.status(500).json({ error: 'Erro interno' })
  }
}
