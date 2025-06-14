// src/app/components/Menu.tsx

'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Menu as MenuIcon, X, LogOut, User, ChevronDown, Bell, Briefcase, Users, UserPlus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Menu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
  const pathname = usePathname()
  const { data: session } = useSession()

  const profileRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [])
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: Briefcase },
    { id: 'vagas', label: 'Vagas', href: '/vagas', icon: Briefcase },
    { id: 'candidatos', label: 'Candidatos', href: '/candidatos', icon: Users },
    { id: 'usuarios', label: 'Usuários', href: '/perfil/usuarios', icon: UserPlus },
  ]
  
  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
  }

  // Se a sessão ainda estiver carregando, não renderiza nada para evitar piscar a tela
  if (!session) {
    return null;
  }
  
  const user = session.user;

  // --- LÓGICA DA IMAGEM ---
  // A URL da imagem agora aponta para a nossa API, que decide se mostra
  // a foto do usuário ou a imagem padrão.
  const userImageSrc = '/api/user/avatar';

  return (
    <header className="bg-white text-slate-800 shadow-md sticky top-0 z-40 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
              <Briefcase className="h-7 w-7 text-indigo-600" />
              <span className="text-xl font-bold text-slate-800 hidden sm:block">RH System</span>
            </Link>
            <nav className="hidden md:flex items-center gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname.startsWith(item.href)
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <Bell size={20} />
              </button>
              
              <div className="h-6 w-px bg-slate-200" />

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 hover:bg-slate-100 rounded-full transition-colors"
                >
                  {/* --- ALTERAÇÃO 1 AQUI --- */}
                  <Image
                    key={user.id} // Adicionar uma chave ajuda o Next.js a recarregar a imagem se o usuário mudar
                    src={userImageSrc}
                    alt="Foto do usuário"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  <span className="font-semibold text-sm text-slate-700 hidden lg:block">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown 
                    size={16} 
                    className={`text-slate-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        {/* --- ALTERAÇÃO 2 AQUI --- */}
                        <Image
                          key={`${user.id}-dropdown`} // Chave única para esta imagem
                          src={userImageSrc}
                          alt="Foto do usuário"
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">{user?.name}</div>
                          <div className="text-sm text-gray-500 truncate">{user?.email}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-1">
                      <Link href="/perfil" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                        <User size={16} />
                        <span>Minha Conta</span>
                      </Link>
                    </div>
                    
                    <div className="border-t border-slate-100 pt-1">
                      <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut size={16} />
                        <span>Sair</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden bg-white border-t border-slate-200 shadow-lg">
          <nav className="px-4 py-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname.startsWith(item.href)
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}