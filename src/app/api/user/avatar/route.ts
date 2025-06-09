// src/app/api/user/avatar/route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    // Se não houver sessão, redireciona para a imagem padrão
    return NextResponse.redirect(new URL('/user-placeholder.png', process.env.NEXT_PUBLIC_BASE_URL))
  }

  try {
    const user = await prisma.usuario.findUnique({
      where: { id: Number(session.user.id) },
      select: { fotourl: true },
    })

    if (user?.fotourl) {
      // Se encontrou a foto, decodifica o base64 e retorna como imagem
      const imageBuffer = Buffer.from(user.fotourl, 'base64')
      
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': 'image/png', // ou o tipo de imagem que você salva
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      })
    } else {
      // Se não tem foto, redireciona para a imagem padrão
      return NextResponse.redirect(new URL('/user-placeholder.png', process.env.NEXT_PUBLIC_BASE_URL))
    }
  } catch (error) {
    console.error("Erro ao buscar avatar:", error)
    // Em caso de erro, também redireciona para a imagem padrão
    return NextResponse.redirect(new URL('/user-placeholder.png', process.env.NEXT_PUBLIC_BASE_URL))
  }
}