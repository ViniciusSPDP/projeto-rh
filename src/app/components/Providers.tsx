// src/app/components/Providers.tsx

'use client'

import { SessionProvider } from 'next-auth/react'

// Este é um componente de cliente que segura o SessionProvider
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}