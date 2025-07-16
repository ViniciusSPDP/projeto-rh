'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Definindo os tipos para as props (copiado do TemplateEditor)
interface TextElement {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fill: string;
  fontFamily?: string;
  fontStyle?: string;
}

interface TemplateEditorProps {
  backgroundImage: HTMLImageElement | null;
  elements: TextElement[];
  selectedElementId: string | null;
  onDragEnd: (e: any, id: string) => void;
  onElementClick: (id: string) => void;
  onElementUpdate?: (id: string, updates: Partial<TextElement>) => void;
  previewMode?: boolean;
}

// Import dinâmico do TemplateEditor com supressão completa de SSR
const TemplateEditor = dynamic(() => import('./TemplateEditor'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-xl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando editor de templates...</p>
      </div>
    </div>
  )
});

export default function TemplateEditorWrapper(props: TemplateEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Garante que o componente só renderiza após hidratação
    setIsMounted(true);
  }, []);

  // Não renderiza nada até estar completamente hidratado
  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-xl">
        <div className="text-center">
          <div className="animate-pulse rounded-full h-8 w-8 bg-blue-200 mx-auto mb-4"></div>
          <p className="text-gray-600">Inicializando editor...</p>
        </div>
      </div>
    );
  }

  // Renderiza o TemplateEditor apenas após hidratação completa
  return <TemplateEditor {...props} />;
}