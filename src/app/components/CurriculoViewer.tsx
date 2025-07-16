// src/app/components/CurriculoViewer.tsx

'use client';

import { FileText } from 'lucide-react';

interface CurriculoViewerProps {
  url: string | null | undefined;
}

export default function CurriculoViewer({ url }: CurriculoViewerProps) {
  // Caso 1: Candidato não enviou currículo
  if (!url) {
    return (
      <div className="border-2 border-dashed rounded-lg p-12 text-center h-[800px] flex flex-col justify-center items-center">
        <FileText className="mx-auto h-16 w-16 text-gray-400" />
        <p className="mt-4 text-gray-500 font-medium">Nenhum currículo foi anexado por este candidato.</p>
      </div>
    );
  }

  const isPdf = url.toLowerCase().endsWith('.pdf');

  // Caso 2: O currículo é um PDF e pode ser exibido na tela
  if (isPdf) {
    return (
      <div className="w-full h-[800px] border rounded-lg overflow-hidden shadow-inner bg-gray-50">
        <embed src={url} type="application/pdf" width="100%" height="100%" />
      </div>
    );
  }

  // Caso 3: É outro tipo de arquivo (DOC, DOCX, imagem), oferecemos o download
  return (
    <div className="border-2 border-dashed rounded-lg p-12 text-center h-[800px] flex flex-col justify-center items-center">
      <FileText className="mx-auto h-16 w-16 text-gray-400" />
      <p className="mt-4 text-gray-600 font-medium">O currículo está disponível para download.</p>
      <p className="mt-1 text-sm text-gray-500">O formato do arquivo ({url.split('.').pop()}) não pode ser exibido diretamente no navegador.</p>
      <a
        href={url}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Baixar Currículo
      </a>
    </div>
  );
}