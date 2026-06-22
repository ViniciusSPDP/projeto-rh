// app/api/integracoes/whatsapp/qrcode/route.ts

import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth-guard';
import { evolutionFetch, EVOLUTION_API, QRCodeResponse } from '@/lib/evolution-api'

export async function POST() {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    // Primeiro, tentar conectar a instância existente
    const connectResponse = await evolutionFetch(
      `/instance/connect/${EVOLUTION_API.instanceName}`,
      {
        method: 'GET',
      }
    ) as QRCodeResponse

    // Retornar o QR Code em base64
    return NextResponse.json({
      qrcode: connectResponse.base64 || connectResponse.qrcode?.base64,
      pairingCode: connectResponse.qrcode?.pairingCode,
    })
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error)
    
    // Se a instância não existir, vamos criá-la
    try {
      const createResponse = await evolutionFetch(
        '/instance/create',
        {
          method: 'POST',
          body: JSON.stringify({
            instanceName: EVOLUTION_API.instanceName,
            token: EVOLUTION_API.apiKey,
            qrcode: true,
          }),
        }
      )

      return NextResponse.json({
        qrcode: createResponse.qrcode?.base64,
        pairingCode: createResponse.qrcode?.pairingCode,
      })
    } catch (createError) {
      console.error('Erro ao criar instância:', createError)
      return NextResponse.json(
        { error: 'Erro ao gerar QR Code' },
        { status: 500 }
      )
    }
  }
}