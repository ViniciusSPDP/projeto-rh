// src/types/next-auth.d.ts

import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * O objeto `session.user` que o frontend recebe.
   */
  interface Session {
    user: {
      id: string;
      fotourl?: string | null; // <-- ADICIONADO
    } & DefaultSession["user"] // Mantém as propriedades padrão (name, email, image)
  }

  /**
   * O objeto `user` que vem do banco de dados através do `authorize`.
   */
  interface User extends DefaultUser {
    fotourl?: string | null; // <-- ADICIONADO
  }
}

/**
 * O conteúdo do token JWT.
 */
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    fotourl?: string | null; // <-- ADICIONADO
  }
}