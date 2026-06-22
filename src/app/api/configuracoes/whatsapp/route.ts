// app/api/configuracoes/whatsapp/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-guard';
import { promises as fs } from 'fs';
import path from 'path';

// --- CORREÇÃO: Apontar para o arquivo e diretório corretos ---
const DATA_DIR = path.join(process.cwd(), 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'whatsapp-config.json');

// Função para garantir que o diretório /data exista
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Se não for um erro de "diretório já existe", lança a exceção.
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  }
}

// GET - Buscar configurações
export async function GET() {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    // Tenta ler o arquivo.
    const data = await fs.readFile(CONFIG_FILE, 'utf-8');
    return NextResponse.json({ config: JSON.parse(data) });
  } catch (error) {
    // --- MELHORIA: Se o arquivo não existir, retorna a config padrão ---
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      const defaultConfig = {
        disparoAutomatico: false,
        templates: { CONTRATADO: { mensagem: '' }, REPROVADO: { mensagem: '' } },
        delayEntreEnvios: 2000
      };
      return NextResponse.json({ config: defaultConfig });
    }
    // Para outros erros, retorna um erro 500.
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json({ error: 'Erro ao buscar configurações' }, { status: 500 });
  }
}

// POST - Salvar configurações
export async function POST(req: NextRequest) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const config = await req.json();
    
    // Garante que o diretório /data exista antes de escrever.
    await ensureDataDir();
    
    // Escreve no arquivo correto.
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 });
  }
}