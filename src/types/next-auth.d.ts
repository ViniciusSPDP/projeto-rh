// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt"

type Role = "ADMIN" | "USER";

declare module "next-auth" {
  /**
   * O objeto `session.user` que o frontend recebe.
   */
  interface Session {
    user: {
      id: string;
      role: Role;
      fotourl?: string | null;
    } & DefaultSession["user"] // Mantém as propriedades padrão (name, email, image)
  }

  /**
   * O objeto `user` que vem do banco de dados através do `authorize`.
   */
  interface User {
    role?: Role;
    fotourl?: string | null;
  }
}

/**
 * O conteúdo do token JWT.
 */
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: Role;
    fotourl?: string | null;
  }
}
