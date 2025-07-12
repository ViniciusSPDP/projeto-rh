// lib/whatsapp-service.ts

import { evolutionFetch, EVOLUTION_API } from './evolution-api'

// Templates de mensagens
export const MENSAGEM_TEMPLATES = {
  CONTRATADO: {
    titulo: '🎉 Parabéns! Você foi aprovado(a)!',
    corpo: `Olá {{nome}},

Temos o prazer de informar que você foi APROVADO(A) no processo seletivo para a vaga de {{vaga}}.

Entraremos em contato em breve com os próximos passos e detalhes sobre sua contratação.

Seja bem-vindo(a) à nossa equipe!

Atenciosamente,
Equipe de RH`
  },
  REPROVADO: {
    titulo: 'Agradecemos sua participação',
    corpo: `Olá {{nome}},

Agradecemos seu interesse e participação no processo seletivo para a vaga de {{vaga}}.

Após cuidadosa análise, decidimos seguir com outros candidatos cujos perfis se alinham mais especificamente com os requisitos da posição neste momento.

Manteremos seu currículo em nosso banco de talentos para futuras oportunidades.

Desejamos sucesso em sua jornada profissional!

Atenciosamente,
Equipe de RH`
  }
}

// Interface para envio de mensagem
interface EnviarMensagemParams {
  numero: string
  nome: string
  vaga: string
  tipo: 'CONTRATADO' | 'REPROVADO'
}

// Formatar número para o padrão internacional
function formatarNumero(numero: string): string {
  // Remove todos os caracteres não numéricos
  const numeroLimpo = numero.replace(/\D/g, '')
  
  // Se já tem código do país, retorna
  if (numeroLimpo.startsWith('55') && numeroLimpo.length >= 12) {
    return numeroLimpo
  }
  
  // Adiciona código do Brasil se não tiver
  return `55${numeroLimpo}`
}

// Substituir variáveis no template
function substituirVariaveis(texto: string, variaveis: Record<string, string>): string {
  let textoFinal = texto
  
  Object.entries(variaveis).forEach(([chave, valor]) => {
    textoFinal = textoFinal.replace(new RegExp(`{{${chave}}}`, 'g'), valor)
  })
  
  return textoFinal
}

// Enviar mensagem via Evolution API
export async function enviarMensagemWhatsApp({
  numero,
  nome,
  vaga,
  tipo
}: EnviarMensagemParams): Promise<boolean> {
  try {
    const template = MENSAGEM_TEMPLATES[tipo]
    const numeroFormatado = formatarNumero(numero)
    
    console.log(`Preparando envio para ${nome} - Número: ${numeroFormatado}`)
    
    // Substituir variáveis no template
    const mensagem = substituirVariaveis(template.corpo, {
      nome,
      vaga
    })

    const payload = {
      number: `${numeroFormatado}@s.whatsapp.net`,
      text: mensagem,
      options: {
        delay: 1200,
        presence: 'composing',
        linkPreview: false
      },
    }

    console.log('Payload de envio:', JSON.stringify(payload, null, 2))

    // Enviar mensagem de texto
    const response = await evolutionFetch(
      `/message/sendText/${EVOLUTION_API.instanceName}`,
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    )

    console.log(`Mensagem enviada com sucesso para ${nome} (${numeroFormatado})`)
    console.log('Resposta:', response)
    return true
  } catch (error) {
    console.error(`Erro ao enviar mensagem para ${nome}:`, error)
    if (error instanceof Error) {
      console.error('Detalhes do erro:', error.message)
    }
    return false
  }
}

// Verificar se o WhatsApp está conectado
export async function verificarConexaoWhatsApp(): Promise<boolean> {
  try {
    // Primeiro tentar fetchInstances
    try {
      const fetchResponse = await fetch(`${EVOLUTION_API.baseUrl}/instance/fetchInstances`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': EVOLUTION_API.apiKey,
        }
      })

      if (fetchResponse.ok) {
        const instances = await fetchResponse.json()
        const nossaInstancia = instances.find((inst: any) => 
          inst.instance?.instanceName === EVOLUTION_API.instanceName
        )
        
        if (nossaInstancia) {
          const isConnected = nossaInstancia.instance?.state === 'open' || 
                             nossaInstancia.instance?.connectionStatus === 'open'
          
          console.log(`WhatsApp conexão status (fetchInstances): ${isConnected ? 'Conectado' : 'Desconectado'}`)
          return isConnected
        }
      }
    } catch (e) {
      console.log('fetchInstances falhou, tentando connectionState...')
    }

    // Se não funcionou, tentar connectionState
    const status = await evolutionFetch(
      `/instance/connectionState/${EVOLUTION_API.instanceName}`
    )
    
    const isConnected = status.state === 'open' || 
                       status.status === 'open' ||
                       status.instance?.state === 'open' ||
                       status.instance?.status === 'open'
    
    console.log(`WhatsApp conexão status (connectionState): ${isConnected ? 'Conectado' : 'Desconectado'}`)
    return isConnected
  } catch (error) {
    console.error('Erro ao verificar conexão WhatsApp:', error)
    return false
  }
}

// Enviar mensagens em lote com delay
export async function enviarMensagensEmLote(
  mensagens: EnviarMensagemParams[],
  delayEntreEnvios: number = 2000
): Promise<{
  sucesso: number
  falha: number
  detalhes: Array<{ candidato: string; enviado: boolean }>
}> {
  console.log(`Iniciando envio em lote de ${mensagens.length} mensagens`)
  
  const resultados = {
    sucesso: 0,
    falha: 0,
    detalhes: [] as Array<{ candidato: string; enviado: boolean }>
  }

  // Verificar conexão antes de enviar
  console.log('Verificando conexão WhatsApp...')
  const conectado = await verificarConexaoWhatsApp()
  
  if (!conectado) {
    console.error('WhatsApp não está conectado - abortando envio')
    mensagens.forEach(msg => {
      resultados.falha++
      resultados.detalhes.push({
        candidato: msg.nome,
        enviado: false
      })
    })
    return resultados
  }

  console.log('WhatsApp conectado! Iniciando envios...')

  // Enviar mensagens com delay entre cada uma
  for (let i = 0; i < mensagens.length; i++) {
    const mensagem = mensagens[i]
    console.log(`Enviando mensagem ${i + 1} de ${mensagens.length} para ${mensagem.nome}`)
    
    const enviado = await enviarMensagemWhatsApp(mensagem)
    
    if (enviado) {
      resultados.sucesso++
    } else {
      resultados.falha++
    }
    
    resultados.detalhes.push({
      candidato: mensagem.nome,
      enviado
    })

    // Aguardar antes de enviar a próxima
    if (i < mensagens.length - 1) {
      console.log(`Aguardando ${delayEntreEnvios}ms antes da próxima mensagem...`)
      await new Promise(resolve => setTimeout(resolve, delayEntreEnvios))
    }
  }

  console.log('Envio em lote concluído:', resultados)
  return resultados
}