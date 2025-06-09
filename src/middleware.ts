// src/middleware.ts

export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    /*
     * Aplica o middleware a todas as rotas, EXCETO as que estão listadas abaixo:
     * ... (sua lista de exceções)
     * - /: A página inicial (landing page) - AGORA INCLUÍDA NA EXCEÇÃO
     */

    // --- ALTERAÇÃO AQUI: Adicionamos '|$' no final da lista de exceções ---
    '/((?!api|_next/static|_next/image|favicon.ico|login|banco-de-talentos|obrigado|vagas/\\d+/formulario|$).*)'
  ],
}