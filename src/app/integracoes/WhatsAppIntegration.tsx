// app/integracoes/WhatsAppIntegration.tsx

'use client'

import { useState, useEffect } from 'react'
import { QrCode, Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import Image from 'next/image'

interface ConnectionStatus {
  instance: {
    instanceName: string
    status: string
  }
}

export default function WhatsAppIntegration() {
  const [qrCode, setQrCode] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string>('')
  const [connectionInfo, setConnectionInfo] = useState<ConnectionStatus | null>(null)

  // Verificar status da conexão
  const checkConnectionStatus = async () => {
    try {
      const response = await fetch('/api/integracoes/whatsapp/status')
      const data = await response.json()
      
      console.log('Status recebido:', data)
      
      // Verificar diferentes possibilidades de resposta
      const isOpen = data.instance?.status === 'open' || 
                     data.instance?.state === 'open' ||
                     data.instance?.connectionStatus === 'open'
      
      setIsConnected(isOpen)
      setConnectionInfo(data)
      
      // Se estiver conectado, limpar o QR Code
      if (isOpen) {
        setQrCode('')
      }
      
      // Mostrar dados brutos para debug (remover depois)
      if (data.instance?.rawData) {
        console.log('Dados brutos da API:', data.instance.rawData)
      }
    } catch (err) {
      console.error('Erro ao verificar status:', err)
      setIsConnected(false)
    }
  }

  // Verificar status ao montar o componente
  useEffect(() => {
    checkConnectionStatus()
    
    // Verificar status a cada 5 segundos
    const interval = setInterval(checkConnectionStatus, 5000)
    
    return () => clearInterval(interval)
  }, [])

  // Gerar QR Code
  const generateQRCode = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/integracoes/whatsapp/qrcode', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar QR Code')
      }

      const data = await response.json()
      
      if (data.qrcode) {
        setQrCode(data.qrcode)
      } else {
        throw new Error('QR Code não recebido')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Desconectar WhatsApp
  const disconnect = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/integracoes/whatsapp/logout', {
        method: 'POST',
      })

      if (response.ok) {
        setIsConnected(false)
        setQrCode('')
        setConnectionInfo(null)
      }
    } catch (err) {
      setError('Erro ao desconectar' + err  )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Status da Conexão */}
      <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-green-700">Conectado</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Desconectado</span>
            </>
          )}
        </div>
        
        {connectionInfo && isConnected && (
          <span className="text-xs text-gray-500">
            Instância: {connectionInfo.instance.instanceName}
          </span>
        )}
      </div>

      {/* Ações */}
      {!isConnected && !qrCode && (
        <button
          onClick={generateQRCode}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Gerando QR Code...
            </>
          ) : (
            <>
              <QrCode className="h-4 w-4" />
              Conectar WhatsApp
            </>
          )}
        </button>
      )}

      {/* QR Code */}
      {qrCode && !isConnected && (
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="mb-4 text-center text-sm text-gray-600">
              Escaneie o QR Code com seu WhatsApp
            </p>
            
            <div className="relative mx-auto h-64 w-64">
              <Image
                src={qrCode}
                alt="QR Code WhatsApp"
                layout="fill"
                objectFit="contain"
              />
            </div>
            
            <p className="mt-4 text-center text-xs text-gray-500">
              Aguardando conexão...
            </p>
          </div>

          <button
            onClick={generateQRCode}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Gerar novo QR Code
          </button>
        </div>
      )}

      {/* Botão Desconectar */}
      {isConnected && (
        <button
          onClick={disconnect}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-red-600 hover:bg-red-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Desconectando...
            </>
          ) : (
            'Desconectar WhatsApp'
          )}
        </button>
      )}

      {/* Erro */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}