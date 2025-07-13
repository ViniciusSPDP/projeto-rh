// lib/whatsapp-service.ts

import { evolutionFetch, EVOLUTION_API } from './evolution-api';
// O tipo WhatsAppConfig agora será usado, corrigindo o aviso.
import { getWhatsAppConfig, type WhatsAppConfig } from './whatsappConfig';

// A interface 'Template' foi removida, pois o tipo já existe dentro de 'WhatsAppConfig'.

interface ApiError {
  response?: {
    data?: unknown;
  };
  message?: string;
}

interface EnviarMensagemParams {
  numero: string;
  tipo: 'CONTRATADO' | 'REPROVADO';
  variaveis: Record<string, string>;
}

function formatarNumero(numero: string): string {
  const numeroLimpo = numero.replace(/\D/g, '');
  return numeroLimpo.startsWith('55') && numeroLimpo.length >= 12 ? numeroLimpo : `55${numeroLimpo}`;
}

function substituirVariaveis(texto: string, variaveis: Record<string, string>): string {
  return Object.entries(variaveis).reduce(
    (acc, [chave, valor]) => acc.replace(new RegExp(`{{${chave}}}`, 'g'), valor || ''),
    texto
  );
}

export async function enviarMensagemWhatsApp({
  numero,
  tipo,
  variaveis
}: EnviarMensagemParams): Promise<boolean> {
  // CORREÇÃO APLICADA AQUI: Adicionando a tipagem explícita
  const config: WhatsAppConfig = await getWhatsAppConfig();

  try {
    const template = config.templates[tipo];
    if (!template || !template.mensagem) {
      console.error(`Template para o tipo "${tipo}" não encontrado ou está vazio.`);
      return false;
    }

    const numeroFormatado = formatarNumero(numero);
    const nomeCandidato = variaveis.nomeCandidato || 'Candidato';
    console.log(`Preparando envio para ${nomeCandidato} - Número: ${numeroFormatado}`);
    const mensagem = substituirVariaveis(template.mensagem, variaveis);

    const payload = {
      number: numeroFormatado,
      options: { delay: 1200, presence: 'composing' },
      text: mensagem,
    };

    await evolutionFetch(`/message/sendText/${EVOLUTION_API.instanceName}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    console.log(`Mensagem enviada com sucesso para ${nomeCandidato} (${numeroFormatado})`);
    return true;
  } catch (error) {
    console.error(`Erro ao enviar mensagem para ${variaveis.nomeCandidato}:`, error);
    return false;
  }
}

export async function enviarMensagemSimples(numero: string, mensagem: string) {
  try {
    const numeroFormatado = formatarNumero(numero);
    const payload = {
      number: numeroFormatado,
      options: { delay: 1200, presence: 'composing' },
      text: mensagem,
    };

    const response = await evolutionFetch(`/message/sendText/${EVOLUTION_API.instanceName}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    console.log(`Mensagem SIMPLES enviada com sucesso para ${numeroFormatado}`);
    return response;
  } catch (error) {
    const apiError = error as ApiError;
    const errorMessage = apiError.response?.data || apiError.message || 'Erro desconhecido';
    console.error(`ERRO ao enviar mensagem SIMPLES para ${numero}:`, errorMessage);
    throw new Error('Falha ao enviar mensagem simples via Evolution API');
  }
}

export async function verificarConexaoWhatsApp(): Promise<boolean> {
  try {
    const status = await evolutionFetch(`/instance/connectionState/${EVOLUTION_API.instanceName}`);
    const isConnected = status.instance.state === 'open';
    console.log(`WhatsApp conexão status: ${isConnected ? 'Conectado' : 'Desconectado'}`);
    return isConnected;
  } catch (error) {
    console.error('Erro ao verificar conexão WhatsApp:', error);
    return false;
  }
}

export async function enviarMensagensEmLote(
  mensagens: EnviarMensagemParams[]
): Promise<{
  sucesso: number;
  falha: number;
  detalhes: Array<{ candidato: string; enviado: boolean }>;
}> {
  // CORREÇÃO APLICADA AQUI: Adicionando a tipagem explícita
  const config: WhatsAppConfig = await getWhatsAppConfig();
  const delayEntreEnvios = config.delayEntreEnvios || 2000;
  console.log(`Iniciando envio em lote de ${mensagens.length} mensagens com delay de ${delayEntreEnvios}ms`);

  const resultados = {
    sucesso: 0,
    falha: 0,
    detalhes: [] as Array<{ candidato: string; enviado: boolean }>,
  };

  const conectado = await verificarConexaoWhatsApp();
  if (!conectado) {
    console.error('WhatsApp não está conectado - abortando envio em lote.');
    resultados.falha = mensagens.length;
    resultados.detalhes = mensagens.map(msg => ({
      candidato: msg.variaveis.nomeCandidato || 'Desconhecido',
      enviado: false,
    }));
    return resultados;
  }

  console.log('WhatsApp conectado! Iniciando envios...');
  for (const [index, mensagem] of mensagens.entries()) {
    const nomeCandidato = mensagem.variaveis.nomeCandidato || 'Desconhecido';
    console.log(`Enviando mensagem ${index + 1}/${mensagens.length} para ${nomeCandidato}`);
    const enviado = await enviarMensagemWhatsApp(mensagem);
    
    if (enviado) {
      resultados.sucesso++;
    } else {
      resultados.falha++;
    }
    resultados.detalhes.push({ candidato: nomeCandidato, enviado });

    if (index < mensagens.length - 1) {
      console.log(`Aguardando ${delayEntreEnvios}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayEntreEnvios));
    }
  }

  console.log('Envio em lote concluído:', resultados);
  return resultados;
}