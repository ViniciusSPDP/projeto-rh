// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./LayoutWrapper";
import { Toaster } from "react-hot-toast";

// --- ALTERAÇÃO 1: Importe o seu novo componente Providers ---
import Providers from "@/app/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-inter",
});

export const metadata: Metadata = {
  // Título que aparece na aba do navegador
  title: {
    default: 'Conexão RH - Encontre sua Vaga', // Título padrão
    template: '%s | Conexão RH', // Usado em páginas filhas para adicionar um sufixo
  },
  // Descrição do seu site (muito importante para o Google)
  description: 'Plataforma de recrutamento e seleção para encontrar as melhores vagas de emprego e os talentos ideais para sua empresa.',
  // Palavras-chave relevantes para o seu negócio
  keywords: ['vagas', 'emprego', 'recrutamento', 'seleção', 'RH', 'carreira', 'trabalho'],
  // Define o autor ou a empresa
  authors: [{ name: 'S4R41VA' }],
  // Define a cor da barra de endereço em navegadores mobile
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className={`${inter.variable} h-full`}>
      <body
        className="antialiased bg-gray-50 h-full font-sans"
        suppressHydrationWarning={true}
      >
        {/* --- ALTERAÇÃO 2: Envolva o conteúdo com o Providers --- */}
        <Providers>
          <Toaster position="top-center" />
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}