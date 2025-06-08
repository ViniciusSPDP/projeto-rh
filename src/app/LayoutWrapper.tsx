'use client'

import { usePathname } from 'next/navigation'
import Menu from './components/Menu'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Esta lógica verifica todas as rotas que não devem exibir o menu.
  const hideMenu =
    pathname.startsWith('/candidatos/imprimir/') ||
    (pathname?.startsWith('/vagas/') && pathname.endsWith('/formulario')) ||
    pathname === '/login' ||
    pathname === '/obrigado'

  // Se a rota atual for uma daquelas que esconde o menu,
  // renderizamos apenas o conteúdo, que ocupará a tela inteira.
  if (hideMenu) {
    return <>{children}</>
  }

  // Para todas as outras rotas, usamos o layout com a barra de navegação no topo.
  return (
    // O container principal organiza os elementos verticalmente.
    // 'bg-gray-50' garante que toda a área de fundo da tela tenha a cor cinza claro.
    <div className="min-h-screen bg-gray-50">
      {/* O seu componente de Menu no topo */}
      <Menu />

      {/* A área de conteúdo principal. Ela ficará naturalmente abaixo do menu. */}
      {/* Não é mais necessário ter cor de fundo ou padding aqui, pois o layout principal já cuida disso. */}
      <main>
        {children}
      </main>
    </div>
  )
}
