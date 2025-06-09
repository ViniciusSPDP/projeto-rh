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
          // A fotourl NÃO precisa mais ser retornada aqui
          return {
            id: String(user.id),
            name: user.nome,
            email: user.email,
          }
        }
        return null
      },
    }),
  ],

  callbacks: {
    // A fotourl NÃO é mais adicionada ao token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    // A fotourl NÃO é mais adicionada à sessão
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = String(token.id)
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}