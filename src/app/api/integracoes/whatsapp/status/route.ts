// app/api/integracoes/whatsapp/status/route.ts

import { NextResponse } from 'next/server'
import { EVOLUTION_API, evolutionHeaders } from '@/lib/evolution-api'

export async function GET() {
  try {
    console.log('Verificando status da instância:', EVOLUTION_API.instanceName)
    
    // Tentar primeiro o endpoint de fetch instances
    const fetchUrl = `${EVOLUTION_API.baseUrl}/instance/fetchInstances`
    console.log('URL fetch instances:', fetchUrl)
    
    const fetchResponse = await fetch(fetchUrl, {
      method: 'GET',
      headers: evolutionHeaders
    })

    if (fetchResponse.ok) {
      const instances = await fetchResponse.json()
      console.log('Instâncias encontradas:', instances)
      
      // Procurar nossa instância
      const nossaInstancia = instances.find((inst: any) => 
        inst.instance?.instanceName === EVOLUTION_API.instanceName
      )
      
      if (nossaInstancia) {
        console.log('Nossa instância:', nossaInstancia)
        
        // Verificar o state da instância
        const isConnected = nossaInstancia.instance?.state === 'open' || 
                           nossaInstancia.instance?.connectionStatus === 'open'
        
        return NextResponse.json({
          instance: {
            instanceName: EVOLUTION_API.instanceName,
            status: isConnected ? 'open' : 'close',
            state: nossaInstancia.instance?.state,
            connectionStatus: nossaInstancia.instance?.connectionStatus
          }
        })
      }
    }

    // Se não encontrou, tentar o endpoint direto
    const statusUrl = `${EVOLUTION_API.baseUrl}/instance/connectionState/${EVOLUTION_API.instanceName}`
    console.log('Tentando URL direta:', statusUrl)
    
    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: evolutionHeaders
    })

    console.log('Status response:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro na resposta:', errorText)
      throw new Error(`API retornou status ${response.status}`)
    }

    const data = await response.json()
    console.log('Dados recebidos:', JSON.stringify(data, null, 2))

    // Evolution API pode retornar em formatos diferentes
    let status = 'close'
    
    // Verificar diferentes possíveis estruturas de resposta
    if (data.state === 'open' || 
        data.status === 'open' || 
        data.instance?.state === 'open' ||
        data.instance?.status === 'open' ||
        data.connectionStatus === 'open') {
      status = 'open'
    }

    return NextResponse.json({
      instance: {
        instanceName: EVOLUTION_API.instanceName,
        status: status,
        rawData: data // Incluir dados brutos para debug
      }
    })
    
  } catch (error) {
    console.error('Erro ao verificar status:', error)
    
    return NextResponse.json({
      instance: {
        instanceName: EVOLUTION_API.instanceName,
        status: 'close',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    })
  }
}