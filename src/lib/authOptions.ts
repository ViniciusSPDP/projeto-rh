// src/lib/authOptions.ts

import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'
import prisma from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        senha: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.senha) return null

        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email },
        })

        if (
          user &&
          user.autorizado &&
          await bcrypt.compare(credentials.senha, user.senhahash)
        ) {
          return {
            id: String(user.id),
            name: user.nome,
            email: user.email,
            image: user.fotourl ?? null,
          }
        }

        return null
      },
    }),
  ],

  // ⬇️ AQUI vai o trecho que você perguntou
  callbacks: {
    async jwt({ token, user }) {
      if (user && user.id) {
        token.id = String(user.id)
      }
      return token
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = String(token.id)
      }
      return session
    },
  },
}