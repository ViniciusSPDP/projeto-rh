// src/lib/whatsappConfig.ts

import fs from 'fs/promises';
import path from 'path';

export interface WhatsAppConfig {
  disparoAutomatico: boolean;
  templates: {
    CONTRATADO: { mensagem: string };
    REPROVADO: { mensagem: string };
  };
  delayEntreEnvios: number;
}

// --- CONFIRMAÇÃO: Usando o mesmo caminho da API ---
const configFilePath = path.join(process.cwd(), 'data', 'whatsapp-config.json');

export async function getWhatsAppConfig(): Promise<WhatsAppConfig> {
  try {
    const fileContent = await fs.readFile(configFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error: unknown) {
    // Se o arquivo não for encontrado, retorna a configuração padrão.
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return {
        disparoAutomatico: false,
        templates: {
          CONTRATADO: { mensagem: '' },
          REPROVADO: { mensagem: '' }
        },
        delayEntreEnvios: 2000
      };
    }
    // Para outros erros, lança a exceção.
    throw error;
  }
}