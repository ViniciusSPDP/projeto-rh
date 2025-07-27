// src/app/layout.tsx

import { Metadata, Viewport } from 'next';
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./LayoutWrapper";
import { Toaster } from "react-hot-toast";
import Providers from "@/app/components/Providers";
import Script from 'next/script'; // Importe o componente Script

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
      <head>
        {/* Usando o componente Script para o GTM */}
        <Script
          id="google-tag-manager" // Um ID único para o script
          strategy="afterInteractive" // Carrega o script após a página ser interativa
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WJNJ23GL');
            `,
          }}
        />
      </head>
      <body
        className="antialiased bg-gray-50 h-full font-sans"
        suppressHydrationWarning={true}
      >
        {/* A tag noscript ainda vai no <body> */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WJNJ23GL"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <Providers>
          <Toaster position="top-center" />
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}