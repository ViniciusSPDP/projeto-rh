// src/app/page.tsx

import Link from 'next/link'
import { ArrowRight, Briefcase, Users, PieChart } from 'lucide-react'

// Para manter o código organizado, podemos criar pequenos componentes aqui mesmo.
// Se eles crescerem, podem ser movidos para a pasta /components.

// Componente para o Cabeçalho
const Header = () => (
  <header className="bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-slate-200">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-2">
        <Briefcase className="h-7 w-7 text-indigo-600" />
        <span className="text-xl font-bold text-slate-800">RH System</span>
      </Link>
      <nav>
        <Link 
          href="/login"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Entrar
        </Link>
      </nav>
    </div>
  </header>
);

// Componente para a Seção de Funcionalidades
const FeatureCard = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{children}</p>
  </div>
);


// --- Componente Principal da Página (Landing Page) ---
export default function LandingPage() {
  return (
    <div className="bg-slate-50 text-slate-800">
      <Header />

      <main>
        {/* Seção Hero */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 text-center bg-gradient-to-b from-white to-indigo-50">
           <div className="container mx-auto px-6">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
                A plataforma completa para gerenciar seus talentos.
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10">
                Otimize seu RH, do recrutamento à gestão de candidatos. Centralize vagas, analise perfis e tome decisões mais inteligentes com nossa plataforma intuitiva.
              </p>
              <div className="flex justify-center items-center gap-4">
                  <Link 
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg text-base font-semibold hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-lg"
                  >
                    <span>Começar Agora</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
              </div>
           </div>
        </section>

        {/* Seção de Funcionalidades */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Tudo que você precisa em um só lugar</h2>
              <p className="mt-4 text-lg text-slate-600">Ferramentas poderosas para simplificar seu dia a dia.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard icon={Briefcase} title="Gestão de Vagas Simplificada">
                Crie, gerencie e encerre vagas com um fluxo de trabalho claro e organizado. Acompanhe o status de cada processo seletivo em tempo real.
              </FeatureCard>
              <FeatureCard icon={Users} title="Central de Candidatos">
                Tenha um banco de talentos unificado. Filtre, selecione e mova candidatos entre as etapas do processo com facilidade.
              </FeatureCard>
              <FeatureCard icon={PieChart} title="Análise e Relatórios">
                Obtenha insights valiosos sobre seus processos de recrutamento para tomar decisões baseadas em dados e otimizar suas contratações.
              </FeatureCard>
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="bg-slate-900 text-slate-400 py-6">
        <div className="container mx-auto px-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} RH System. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}