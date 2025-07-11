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
    
    // Substituir variáveis no template
    const mensagem = substituirVariaveis(template.corpo, {
      nome,
      vaga
    })

    // Enviar mensagem de texto
    await evolutionFetch(
      `/message/sendText/${EVOLUTION_API.instanceName}`,
      {
        method: 'POST',
        body: JSON.stringify({
          number: `${numeroFormatado}@s.whatsapp.net`,
          options: {
            delay: 1200,
            presence: 'composing',
            linkPreview: false
          },
          textMessage: {
            text: mensagem
          }
        })
      }
    )

    console.log(`Mensagem enviada para ${nome} (${numeroFormatado})`)
    return true
  } catch (error) {
    console.error(`Erro ao enviar mensagem para ${nome}:`, error)
    return false
  }
}

// Verificar se o WhatsApp está conectado
export async function verificarConexaoWhatsApp(): Promise<boolean> {
  try {
    const status = await evolutionFetch(
      `/instance/connectionState/${EVOLUTION_API.instanceName}`
    )
    
    return status.instance?.status === 'open'
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
  const resultados = {
    sucesso: 0,
    falha: 0,
    detalhes: [] as Array<{ candidato: string; enviado: boolean }>
  }

  // Verificar conexão antes de enviar
  const conectado = await verificarConexaoWhatsApp()
  if (!conectado) {
    console.error('WhatsApp não está conectado')
    return resultados
  }

  // Enviar mensagens com delay entre cada uma
  for (const mensagem of mensagens) {
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
    if (mensagens.indexOf(mensagem) < mensagens.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayEntreEnvios))
    }
  }

  return resultados
}