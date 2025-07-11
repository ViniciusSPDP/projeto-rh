// app/integracoes/page.tsx

import { Smartphone, WifiOff } from 'lucide-react'
import WhatsAppIntegration from './WhatsAppIntegration'

export default function IntegracoesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-6">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Integrações</h1>
          <p className="mt-2 text-gray-600">
            Gerencie as integrações do sistema com serviços externos
          </p>
        </div>

        {/* Grid de Integrações */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card WhatsApp */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-3">
                  <Smartphone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">WhatsApp</h2>
                  <p className="text-sm text-gray-500">Evolution API</p>
                </div>
              </div>
            </div>
            
            <p className="mb-4 text-sm text-gray-600">
              Conecte o WhatsApp para enviar mensagens automáticas aos candidatos sobre o status do processo seletivo.
            </p>

            <WhatsAppIntegration />
          </div>

          {/* Placeholder para futuras integrações */}
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6">
            <div className="text-center">
              <WifiOff className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-sm font-medium text-gray-900">Email</h3>
              <p className="mt-2 text-sm text-gray-500">Em breve</p>
            </div>
          </div>

          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6">
            <div className="text-center">
              <WifiOff className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-sm font-medium text-gray-900">SMS</h3>
              <p className="mt-2 text-sm text-gray-500">Em breve</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}