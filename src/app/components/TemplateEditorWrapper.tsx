'use client';

import { useEffect, useState } from 'react';
import type Konva from 'konva';

// Definindo os tipos para as props
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
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>, id: string) => void;
  onElementClick: (id: string) => void;
  onElementUpdate?: (id: string, updates: Partial<TextElement>) => void;
  previewMode?: boolean;
}

export default function TemplateEditorWrapper(props: TemplateEditorProps) {
  const [TemplateEditor, setTemplateEditor] = useState<React.ComponentType<TemplateEditorProps> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Função para carregar o componente
    const loadEditor = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Aguarda um pouco para garantir que o DOM está pronto
        await new Promise(resolve => setTimeout(resolve, 100));

        // Import dinâmico do TemplateEditor
        const module = await import('./TemplateEditor');
        
        if (isMounted) {
          setTemplateEditor(() => module.default);
        }
      } catch (err) {
        console.error('Erro ao carregar TemplateEditor:', err);
        if (isMounted) {
          setError('Erro ao carregar o editor de templates');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Só carrega no cliente
    if (typeof window !== 'undefined') {
      loadEditor();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Estado de loading
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-xl min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando editor de templates...</p>
        </div>
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-xl min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }

  // Estado quando o componente não foi carregado
  if (!TemplateEditor) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-xl min-h-[400px]">
        <div className="text-center">
          <div className="text-gray-400 text-xl mb-4">🎨</div>
          <p className="text-gray-600">Editor não disponível</p>
        </div>
      </div>
    );
  }

  // Renderiza o componente quando carregado
  return <TemplateEditor {...props} />;
}