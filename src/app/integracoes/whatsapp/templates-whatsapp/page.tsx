// app/configuracoes/templates-whatsapp/page.tsx

import { MessageSquare } from 'lucide-react'
import TemplatesWhatsApp from './TemplatesWhatsApp'

export default function TemplatesWhatsAppPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-6">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-full bg-green-100 p-2">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Templates de Mensagens WhatsApp</h1>
          </div>
          <p className="text-gray-600">
            Configure as mensagens que serão enviadas automaticamente aos candidatos
          </p>
        </div>

        <TemplatesWhatsApp />
      </div>
    </main>
  )
}