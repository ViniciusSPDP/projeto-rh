'use client'

import { signIn } from 'next-auth/react'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn, AtSign, KeyRound, LoaderCircle, Briefcase } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await signIn('credentials', {
        email,
        senha: password,
        redirect: false,
      })

      if (res?.error) {
        toast.error('E-mail ou senha inválidos. Verifique suas credenciais.')
      } else if (res?.ok) {
        toast.success('Login realizado com sucesso!')
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('Ocorreu um erro inesperado. Tente novamente.')
      console.error("Erro no login:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Coluna Esquerda: Branding e Imagem (visível em telas grandes) */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-indigo-700 text-white p-12">
        <div className="w-full max-w-md text-center">
            <Link href="/" className="inline-block mb-8">
                <Briefcase size={60} className="mx-auto" />
            </Link>
          <h1 className="text-4xl font-bold mb-4">Bem-vindo ao RH System</h1>
          <p className="text-indigo-200 text-lg">
            A plataforma completa para otimizar seus processos de recrutamento e gestão de talentos.
          </p>
        </div>
      </div>

      {/* Coluna Direita: Formulário de Login */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center lg:hidden mb-8">
             <Link href="/" className="inline-block">
                <Briefcase size={40} className="mx-auto text-indigo-600" />
            </Link>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
              Acesse sua Conta
            </h2>
            <p className="text-center text-gray-500 mb-8">
              Entre com suas credenciais para continuar.
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Campo de E-mail com Ícone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-11 pr-4 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="seu@email.com"
                    />
                </div>
              </div>

              {/* Campo de Senha com Ícone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-11 pr-4 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="********"
                    />
                </div>
              </div>

              {/* Botão de Entrar com Estado de Loading */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    Entrar
                  </>
                )}
              </button>
            </form>
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            Não tem uma conta?{' '}
            <a href="#" className="font-medium text-indigo-600 hover:underline">
                Contate o administrador
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
