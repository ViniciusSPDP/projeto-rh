// src/app/layout.tsx

import { Metadata, Viewport } from 'next'; // 1. Importe o 'Viewport'
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
  title: {
    default: 'Conexão RH - Encontre sua Vaga',
    template: '%s | Conexão RH',
  },
  description: 'Plataforma de recrutamento e seleção para encontrar as melhores vagas de emprego e os talentos ideais para sua empresa.',
  keywords: ['vagas', 'emprego', 'recrutamento', 'seleção', 'RH', 'carreira', 'trabalho'],
  authors: [{ name: 'S4R41VA' }],
};

export const viewport: Viewport = {
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