// app/api/configuracoes/whatsapp/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const CONFIG_FILE = path.join(process.cwd(), 'config', 'whatsapp-templates.json')

// Garantir que o diretório existe
async function ensureConfigDir() {
  const dir = path.dirname(CONFIG_FILE)
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
}

// GET - Buscar configurações
export async function GET() {
  try {
    await ensureConfigDir()
    
    try {
      const data = await fs.readFile(CONFIG_FILE, 'utf-8')
      return NextResponse.json({ config: JSON.parse(data) })
    } catch {
      return NextResponse.json({ config: null }, { status: 404 })
    }
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar configurações' },
      { status: 500 }
    )
  }
}

// POST - Salvar configurações
export async function POST(req: NextRequest) {
  try {
    const config = await req.json()
    
    await ensureConfigDir()
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar configurações' },
      { status: 500 }
    )
  }
}