// src/app/api/user/avatar/route.ts

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import prisma from '@/lib/prisma'
import { getObjectBytes, contentTypeFromKey } from '@/lib/minio'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

    const fotourl = user?.fotourl?.trim()

    if (fotourl && fotourl.startsWith('fotos/')) {
      // KEY no MinIO privado: baixa e serve
      const bytes = await getObjectBytes(fotourl)
      if (bytes) {
        return new NextResponse(Buffer.from(bytes), {
          headers: {
            'Content-Type': contentTypeFromKey(fotourl),
            'Content-Length': String(bytes.byteLength),
            'Cache-Control': 'private, max-age=3600',
          },
        })
      }
    } else if (fotourl) {
      // Legado: base64 cru no banco -> decodifica e serve
      const imageBuffer = Buffer.from(fotourl, 'base64')
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      })
    }

    // Sem foto (ou objeto ausente): imagem padrão
    return NextResponse.redirect(new URL('/user-placeholder.png', process.env.NEXT_PUBLIC_BASE_URL))
  } catch (error) {
    console.error("Erro ao buscar avatar:", error)
    // Em caso de erro, também redireciona para a imagem padrão
    return NextResponse.redirect(new URL('/user-placeholder.png', process.env.NEXT_PUBLIC_BASE_URL))
  }
}