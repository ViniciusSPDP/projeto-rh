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
          // --- ALTERAÇÃO: Adicionando 'fotourl' explicitamente ---
          // Isso garante que o objeto 'user' tenha a propriedade 'fotourl'
          return {
            id: String(user.id),
            name: user.nome,
            email: user.email,
            image: user.fotourl, // next-auth usa 'image' por padrão
            fotourl: user.fotourl, // nossa propriedade customizada
          }
        }

        return null
      },
    }),
  ],

  callbacks: {
    // O callback 'jwt' é chamado após o 'authorize'
    async jwt({ token, user }) {
      // O objeto 'user' só está disponível no primeiro login
      if (user) {
        token.id = user.id
        // --- ALTERAÇÃO: Passando a fotourl para o token ---
        token.fotourl = user.fotourl
      }
      return token
    },
    // O callback 'session' usa os dados do token para montar a sessão do cliente
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id
        // --- ALTERAÇÃO: Passando a fotourl do token para a sessão final ---
        session.user.fotourl = token.fotourl
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Não se esqueça de definir esta variável no seu .env
  // pages: { signIn: '/login' }, // Esta linha parece duplicada, removi
}