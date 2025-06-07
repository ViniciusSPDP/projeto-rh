'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const res = await signIn('credentials', {
      email,
      senha: password,
      redirect: false,
    })

    if (res?.error) {
      setError('E-mail ou senha inválidos.')
    } else {
      router.push('/dashboard') // ajuste para o caminho do painel
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        {/* LOGO */}
        <div className="mb-6 text-center">
          {/*<Image
            src="/logo-conexao.png" // coloque a logo na pasta /public
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto"
          />*/}
        </div>

        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
          Acesso ao Painel
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  )
}
