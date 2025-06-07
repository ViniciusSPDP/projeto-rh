'use client'

import { usePathname } from 'next/navigation'
import Menu from './components/Menu'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Esconde o Menu somente na rota específica
  const hideMenu = pathname.startsWith('/candidatos/imprimir/')

  return (
    <>
      {!hideMenu && <Menu />}
      {children}
    </>
  )
}
