// lib/whatsapp-service.ts

import { evolutionFetch, EVOLUTION_API } from './evolution-api'
import { promises as fs } from 'fs'
import path from 'path'

// --- NOVO: Caminho para o arquivo de configuração ---
const CONFIG_FILE = path.join(process.cwd(), 'config', 'whatsapp-templates.json')

// --- NOVO: Interface para as configurações carregadas do JSON ---
interface Template {
  tipo: 'CONTRATADO' | 'REPROVADO'
  titulo: string
  mensagem: string
}

interface EvolutionInstance {
  instance?: {
    instanceName?: string;
    state?: string;
    connectionStatus?: string;
  };
}

interface ConfigWhatsApp {
  templates: {
    CONTRATADO: Template
    REPROVADO: Template
  }
  delayEntreEnvios: number
}

// --- NOVO: Função para carregar as configurações do arquivo JSON ---
async function getWhatsAppConfig(): Promise<ConfigWhatsApp | null> {
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('ERRO: Não foi possível carregar o arquivo de configuração de templates (whatsapp-templates.json).', error)
    return null
  }
}

// Interface para envio de mensagem
interface EnviarMensagemParams {
  numero: string
  tipo: 'CONTRATADO' | 'REPROVADO'
  // Objeto dinâmico para as variáveis
  variaveis: Record<string, string>
}

// Formatar número para o padrão internacional
function formatarNumero(numero: string): string {
  const numeroLimpo = numero.replace(/\D/g, '')
  if (numeroLimpo.startsWith('55') && numeroLimpo.length >= 12) {
    return numeroLimpo
  }
  return `55${numeroLimpo}`
}

// Função para substituir variáveis (já dinâmica, sem alterações)
function substituirVariaveis(texto: string, variaveis: Record<string, string>): string {
  let textoFinal = texto
  Object.entries(variaveis).forEach(([chave, valor]) => {
    textoFinal = textoFinal.replace(new RegExp(`{{${chave}}}`, 'g'), valor || '') // Garante que não insira 'undefined'
  })
  return textoFinal
}

// --- ATUALIZADO: Enviar mensagem via Evolution API ---
export async function enviarMensagemWhatsApp({
  numero,
  tipo,
  variaveis
}: EnviarMensagemParams): Promise<boolean> {
  // Carrega as configurações do JSON
  const config = await getWhatsAppConfig()
  if (!config) {
    console.error(`Envio para ${numero} falhou: arquivo de configuração não encontrado.`)
    return false
  }

  try {
    // Seleciona o template do arquivo de configuração
    const template = config.templates[tipo]
    if (!template) {
      console.error(`Template para o tipo "${tipo}" não encontrado na configuração.`)
      return false
    }

    const numeroFormatado = formatarNumero(numero)
    const nomeCandidato = variaveis.nomeCandidato || 'Candidato'

    console.log(`Preparando envio para ${nomeCandidato} - Número: ${numeroFormatado}`)

    // Substitui as variáveis no template carregado
    const mensagem = substituirVariaveis(template.mensagem, variaveis)

    const payload = {
      number: numeroFormatado, // Não precisa mais do @s.whatsapp.net na Evolution API mais recente
      text: mensagem,
      options: {
        delay: 1200,
        presence: 'composing'
      }
    }

    console.log('Payload de envio:', JSON.stringify(payload, null, 2))

    // Envia a mensagem
    const response = await evolutionFetch(
      `/message/sendText/${EVOLUTION_API.instanceName}`,
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    )

    console.log(`Mensagem enviada com sucesso para ${nomeCandidato} (${numeroFormatado})`)
    console.log('Resposta:', response)
    return true
  } catch (error) {
    console.error(`Erro ao enviar mensagem para ${variaveis.nomeCandidato}:`, error)
    if (error instanceof Error) {
      console.error('Detalhes do erro:', error.message)
    }
    return false
  }
}

// Verificar se o WhatsApp está conectado (sem alterações)
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
        // ✅ CORREÇÃO APLICADA AQUI
        const instances: EvolutionInstance[] = await fetchResponse.json();
        const nossaInstancia = instances.find((inst: EvolutionInstance) =>
          inst.instance?.instanceName === EVOLUTION_API.instanceName
        );

        if (nossaInstancia) {
          const isConnected = nossaInstancia.instance?.state === 'open' ||
            nossaInstancia.instance?.connectionStatus === 'open';

          console.log(`WhatsApp conexão status (fetchInstances): ${isConnected ? 'Conectado' : 'Desconectado'}`);
          return isConnected;
        }
      }
    } catch {
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


// --- ATUALIZADO: Enviar mensagens em lote com delay ---
export async function enviarMensagensEmLote(
  mensagens: EnviarMensagemParams[]
): Promise<{
  sucesso: number
  falha: number
  detalhes: Array<{ candidato: string; enviado: boolean }>
}> {
  console.log('ESTRUTURA RECEBIDA PELO SERVIÇO:', JSON.stringify(mensagens, null, 2));

  // Carrega o delay do arquivo de configuração
  const config = await getWhatsAppConfig()
  const delayEntreEnvios = config?.delayEntreEnvios || 2000 // Usa o delay salvo ou 2s como padrão

  console.log(`Iniciando envio em lote de ${mensagens.length} mensagens com delay de ${delayEntreEnvios}ms`)

  const resultados = {
    sucesso: 0,
    falha: 0,
    detalhes: [] as Array<{ candidato: string; enviado: boolean }>
  }

  // Verificar conexão antes de enviar
  const conectado = await verificarConexaoWhatsApp()
  if (!conectado) {
    console.error('WhatsApp não está conectado - abortando envio')
    mensagens.forEach(msg => {
      resultados.falha++
      resultados.detalhes.push({
        candidato: msg.variaveis.nomeCandidato || 'Desconhecido',
        enviado: false
      })
    })
    return resultados
  }

  console.log('WhatsApp conectado! Iniciando envios...')

  // Enviar mensagens com delay entre cada uma
  for (let i = 0; i < mensagens.length; i++) {
    const mensagem = mensagens[i]
    const nomeCandidato = mensagem.variaveis.nomeCandidato || 'Desconhecido'
    console.log(`Enviando mensagem ${i + 1} de ${mensagens.length} para ${nomeCandidato}`)

    const enviado = await enviarMensagemWhatsApp(mensagem)

    if (enviado) {
      resultados.sucesso++
    } else {
      resultados.falha++
    }

    resultados.detalhes.push({
      candidato: nomeCandidato,
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