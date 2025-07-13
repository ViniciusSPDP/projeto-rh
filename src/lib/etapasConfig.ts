// src/lib/etapasConfig.ts

import fs from 'fs/promises';
import path from 'path';
import type { EtapasConfig } from '@/types/configuracoes'; // Usando a interface que já criamos

const CONFIG_FILE = path.join(process.cwd(), 'data', 'etapas-config.json');

/**
 * Lê a configuração de notificação por etapa.
 * Retorna uma configuração padrão caso o arquivo não exista.
 */
export async function getEtapasConfig(): Promise<EtapasConfig> {
  try {
    const fileContent = await fs.readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      // Retorna o padrão se o arquivo não existir
      return {
        disparoPorEtapaAtivado: false,
        templatesPorEtapa: {},
        delayEntreEnvios: 2000 // Valor padrão adicionado
      };
    }
    throw error; // Lança outros erros
  }
}