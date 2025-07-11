// lib/evolution-api.ts

// Configurações da Evolution API
export const EVOLUTION_API = {
  baseUrl: process.env.EVOLUTION_API_URL || 'http://localhost:8080',
  apiKey: process.env.EVOLUTION_API_KEY || '',
  instanceName: 'RH', // Nome da instância que você criou
}

// Headers padrão para as requisições
export const evolutionHeaders = {
  'Content-Type': 'application/json',
  'apikey': EVOLUTION_API.apiKey,
}

// Tipos de resposta da API
export interface QRCodeResponse {
  base64: string
  code: string
  qrcode: {
    instance: string
    pairingCode: string
    code: string
    base64: string
  }
}

export interface InstanceStatus {
  instance: {
    instanceName: string
    owner: string
    profileName: string
    profilePictureUrl: string
    profileStatus: string
    status: string
  }
}

// Funções auxiliares
export async function evolutionFetch(
  endpoint: string,
  options?: RequestInit
) {
  const url = `${EVOLUTION_API.baseUrl}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...evolutionHeaders,
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Evolution API Error: ${error}`)
  }

  return response.json()
}