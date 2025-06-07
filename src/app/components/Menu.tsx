'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu as MenuIcon, X, LogOut, User, Settings, ChevronDown, Bell, Search } from 'lucide-react'
import Image from 'next/image'

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [activeItem, setActiveItem] = useState('dashboard')
  const profileRef = useRef(null)
  const mobileMenuRef = useRef(null)

  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleProfile = () => setShowProfile(!showProfile)

  // Fecha o menu mobile ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fecha menus ao pressionar ESC
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        setShowProfile(false)
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => document.removeEventListener('keydown', handleEscKey)
  }, [])

  // Simula dados do usuário logado
  const user = {
    name: 'Vinicius Saraiva',
    email: 'vinicius_saraiva2012@hotmail.com',
    photo: '/user-placeholder.png',
    notifications: 3
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/' },
    { id: 'candidatos', label: 'Candidatos', href: '/candidatos' },
    { id: 'relatorios', label: 'Relatórios', href: '/relatorios' },
    { id: 'configuracoes', label: 'Configurações', href: '/configuracoes' }
  ]

  const handleItemClick = (itemId) => {
    setActiveItem(itemId)
    setIsOpen(false)
  }

  return (
    <>
      <header className="bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold bg-white text-blue-700 px-3 py-1 rounded-lg">
                LOGO
              </div>
            </div>

            {/* Barra de busca - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200" size={18} />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-2 bg-blue-600 border border-blue-500 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                />
              </div>
            </div>

            {/* Menu Desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {menuItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveItem(item.id)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeItem === item.id
                      ? 'bg-white text-blue-700 font-semibold'
                      : 'hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Área do usuário - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {/* Notificações */}
              <button className="relative p-2 hover:bg-blue-600 rounded-lg transition-colors">
                <Bell size={20} />
                {user.notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {user.notifications}
                  </span>
                )}
              </button>

              {/* Perfil do usuário */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfile}
                  className="flex items-center gap-2 p-2 hover:bg-blue-600 rounded-lg transition-colors"
                  aria-expanded={showProfile}
                  aria-haspopup="true"
                >
                  <Image
                    src={user.photo}
                    alt="Foto do usuário"
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-white"
                  />
                  <span className="font-medium hidden lg:block">{user.name.split(' ')[0]}</span>
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown do perfil */}
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <Image
                          src={user.photo}
                          alt="Foto do usuário"
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">{user.name}</div>
                          <div className="text-sm text-gray-500 truncate">{user.email}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-1">
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                        <User size={18} />
                        <span>Minha Conta</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                        <Settings size={18} />
                        <span>Configurações</span>
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-1">
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut size={18} />
                        <span>Sair</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botão Mobile */}
            <button 
              className="md:hidden p-2 hover:bg-blue-600 rounded-lg transition-colors" 
              onClick={toggleMenu}
              aria-expanded={isOpen}
              aria-label="Menu principal"
            >
              {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>

          {/* Barra de busca - Mobile */}
          <div className="mt-3 lg:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200" size={18} />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 bg-blue-600 border border-blue-500 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        {isOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden bg-blue-800 border-t border-blue-600 shadow-lg"
          >
            <nav className="px-4 py-3 space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => handleItemClick(item.id)}
                  className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeItem === item.id
                      ? 'bg-white text-blue-700 font-semibold'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            
            {/* Área do usuário - Mobile */}
            <div className="border-t border-blue-600 px-4 py-3">
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src={user.photo}
                  alt="Foto do usuário"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white"
                />
                <div className="flex-1">
                  <div className="font-medium text-white">{user.name}</div>
                  <div className="text-sm text-blue-200">{user.email}</div>
                </div>
                <button className="relative p-2 hover:bg-blue-700 rounded-lg">
                  <Bell size={18} />
                  {user.notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {user.notifications}
                    </span>
                  )}
                </button>
              </div>
              
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-blue-100 hover:bg-blue-700 rounded-lg transition-colors">
                  <User size={18} />
                  <span>Minha Conta</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-blue-100 hover:bg-blue-700 rounded-lg transition-colors">
                  <Settings size={18} />
                  <span>Configurações</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-red-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors">
                  <LogOut size={18} />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}