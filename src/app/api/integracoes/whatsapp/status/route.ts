// app/api/integracoes/whatsapp/status/route.ts

import { NextResponse } from 'next/server'
import { evolutionFetch, EVOLUTION_API, InstanceStatus } from '@/lib/evolution-api'

export async function GET() {
  try {
    // Verificar o status da conexão
    const status = await evolutionFetch(
      `/instance/connectionState/${EVOLUTION_API.instanceName}`
    ) as InstanceStatus

    return NextResponse.json(status)
  } catch (error) {
    console.error('Erro ao verificar status:', error)
    
    // Se der erro, provavelmente a instância não existe ou está desconectada
    return NextResponse.json({
      instance: {
        instanceName: EVOLUTION_API.instanceName,
        status: 'disconnected'
      }
    })
  }
}