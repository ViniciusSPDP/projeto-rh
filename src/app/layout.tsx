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
  title: "Sistema de RH",
  description: "Gerenciamento de Vagas e Candidatos",
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