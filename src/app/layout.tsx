// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./LayoutWrapper";
// 1. ADICIONE A IMPORTAÇÃO AQUI
import { Toaster } from "react-hot-toast";

// Configuração da fonte Inter, que é muito estável com Next.js e Tailwind
const inter = Inter({
  subsets: ["latin"],
  display: 'swap', // Melhora a performance de carregamento da fonte
  variable: "--font-inter", // Define a variável CSS para a fonte
});

export const metadata: Metadata = {
  title: "Sistema de RH",
  description: "Gerenciamento de Vagas e Candidatos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // A classe da variável da fonte é aplicada na tag <html>
    <html lang="pt-br" className={`${inter.variable} h-full`}>
      {/* O body herda a fonte e aplica a cor de fundo */}
      <body
        className="antialiased bg-gray-50 h-full font-sans"
        suppressHydrationWarning={true}
      >
        {/* 2. ADICIONE O TOASTER AQUI, DENTRO DO BODY */}
        <Toaster position="top-center" />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}