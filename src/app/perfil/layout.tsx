// src/app/perfil/layout.tsx

'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Users } from 'lucide-react';

const menuItems = [
    { name: 'Meu Perfil', href: '/perfil', icon: User },
    { name: 'Gerenciar Usuários', href: '/perfil/usuarios', icon: Users },
]

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="container mx-auto max-w-7xl py-10 px-4">
            <div className="flex flex-col md:flex-row gap-10">
                {/* Menu Lateral */}
                <aside className="w-full md:w-1/4 lg:w-1/5">
                    <nav className="space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    pathname === item.href
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Conteúdo Principal */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}