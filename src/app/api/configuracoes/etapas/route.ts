// src/app/api/configuracoes/etapas/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-guard';
import { promises as fs } from 'fs';
import path from 'path';
import type { EtapasConfig } from '@/types/configuracoes'; // Importando nosso novo tipo

// Define o caminho para o novo arquivo de configuração
const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'etapas-config.json');

// Função auxiliar para garantir que o diretório /data exista
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  }
}

/**
 * GET - Busca a configuração de disparo por etapa.
 * Se o arquivo não existir, retorna uma configuração padrão vazia.
 */
export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Acesso restrito a administradores' }, { status: 403 });
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf-8');
    return NextResponse.json({ config: JSON.parse(data) });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // Retorna um objeto padrão se o arquivo não for encontrado
      const defaultConfig: EtapasConfig = {
        disparoPorEtapaAtivado: false,
        templatesPorEtapa: {}, // Começa sem nenhum template
        delayEntreEnvios: 2000 // Valor padrão de 2 segundos
      };
      return NextResponse.json({ config: defaultConfig });
    }
    console.error('Erro ao buscar configurações de etapas:', error);
    return NextResponse.json({ error: 'Erro ao buscar configurações' }, { status: 500 });
  }
}

/**
 * POST - Salva a configuração de disparo por etapa.
 */
export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Acesso restrito a administradores' }, { status: 403 });
  try {
    const config: EtapasConfig = await req.json();
    
    await ensureDataDir();
    
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
    
    return NextResponse.json({ success: true, message: 'Configurações de etapas salvas com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar configurações de etapas:', error);
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 });
  }
}