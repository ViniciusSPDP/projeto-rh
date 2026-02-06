// src/app/components/CurriculoViewer.tsx

'use client';

import { useState } from 'react';
import { FileText, Download, ExternalLink, AlertCircle } from 'lucide-react';

interface CurriculoViewerProps {
  url: string | null | undefined;
}

export default function CurriculoViewer({ url }: CurriculoViewerProps) {
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);

  // Caso 1: Candidato não enviou currículo
  if (!url || url.trim() === '') {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center h-full flex flex-col justify-center items-center bg-gray-50">
        <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <p className="text-gray-600 font-medium text-lg mb-2">Nenhum currículo anexado</p>
        <p className="text-gray-500 text-sm">Este candidato não enviou um currículo.</p>
      </div>
    );
  }

  // Verificar se é PDF (verificação simples por extensão)
  const isPdf = url.toLowerCase().includes('.pdf');
  
  if (!isPdf) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center h-full flex flex-col justify-center items-center bg-gray-50">
        <AlertCircle className="mx-auto h-16 w-16 text-amber-500 mb-4" />
        <p className="text-gray-600 font-medium text-lg mb-2">Formato não suportado</p>
        <p className="text-gray-500 text-sm mb-4">Apenas arquivos PDF podem ser visualizados.</p>
        <a
          href={url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Baixar Arquivo
        </a>
      </div>
    );
  }

  // --- CORREÇÃO AQUI ---
  // Lógica inteligente para definir a URL:
  // 1. Se começar com 'http' (http ou https), é uma URL externa (MinIO/S3) -> Mantém como está.
  // 2. Se começar com '/', é um caminho absoluto local -> Mantém como está.
  // 3. Se não tiver nenhum dos dois, assume que é um arquivo local relativo -> Adiciona '/' no início.
  let pdfUrl = url;
  if (!url.startsWith('http') && !url.startsWith('/')) {
      pdfUrl = `/${url}`;
  }

  if (loadError) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center h-full flex flex-col justify-center items-center bg-gray-50">
        <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <p className="text-gray-600 font-medium text-lg mb-2">Erro ao carregar PDF</p>
        <p className="text-gray-500 text-sm mb-4">Não foi possível exibir o arquivo. Tente fazer o download.</p>
        <div className="flex gap-3">
          <a
            href={pdfUrl}
            download
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Baixar PDF
          </a>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Abrir em nova aba
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border rounded-lg overflow-hidden shadow-inner bg-white relative" style={{ height: '1200px' }}>
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando PDF...</p>
          </div>
        </div>
      )}
      
      {/* Barra de controle */}
      <div className="absolute top-4 right-4 z-20 flex gap-2 bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200">
        {/* Controles de Zoom */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))}
            className="p-1 hover:bg-gray-100 rounded text-gray-600 text-sm font-bold"
            title="Diminuir zoom"
          >
            -
          </button>
          <span className="text-xs text-gray-600 min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(prev => Math.min(2, prev + 0.25))}
            className="p-1 hover:bg-gray-100 rounded text-gray-600 text-sm font-bold"
            title="Aumentar zoom"
          >
            +
          </button>
        </div>

        {/* Botões de ação */}
        <a
          href={pdfUrl}
          download
          className="p-2 hover:bg-gray-100 text-gray-700 rounded transition-colors"
          title="Baixar PDF"
        >
          <Download className="w-4 h-4" />
        </a>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-gray-100 text-gray-700 rounded transition-colors"
          title="Abrir em nova aba"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Container do PDF com scroll */}
      <div className="w-full h-full overflow-auto bg-gray-100">
        <div 
          className="w-full h-full flex justify-center"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            minHeight: `${1200 / zoom}px`
          }}
        >
          {/* PDF Embed */}
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0&view=FitH`}
            width="100%"
            height="1200px"
            style={{ 
              border: 'none',
              backgroundColor: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setLoadError(true);
            }}
            title="Visualização do Currículo"
          />
        </div>
      </div>
    </div>
  );
}