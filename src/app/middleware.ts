// src/middleware.ts

// A maneira mais simples de proteger rotas com NextAuth.
// Ele usa a sua configuração de `authOptions` por baixo dos panos.
export { default } from "next-auth/middleware"

// O 'matcher' define quais rotas serão protegidas pelo middleware.
export const config = {
  matcher: [
    /*
     * Aplica o middleware a todas as rotas, EXCETO as que estão listadas abaixo:
     * - /api/: Rotas de API
     * - /_next/static: Arquivos estáticos do Next.js
     * - /_next/image: Arquivos de otimização de imagem do Next.js
     * - /favicon.ico: O ícone do site
     * - /login: A página de login
     * - /: A página inicial (sua landing page)
     * - /banco-de-talentos: A página pública do banco de talentos
     * - /obrigado: A página de agradecimento pós-cadastro
     * - /vagas/[id]/formulario: As páginas públicas de formulário de vaga
     *
     * A sintaxe `(?!...)` é um "negative lookahead" em regex, que significa "não corresponder a...".
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|banco-de-talentos|obrigado|vagas/\\d+/formulario).*)'
  ],
}