// src/app/integracoes/imagem-template/novo/page.tsx

'use client'; 

import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Text as KonvaText } from 'react-konva';
import Konva from 'konva';
import { useRouter } from 'next/navigation';

// Definindo o tipo para os nossos elementos de texto
interface TextElement {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fill: string;
}

export default function NovoTemplateDeImagemPage() {
  const router = useRouter();

  // Estados do nosso editor
  const [templateName, setTemplateName] = useState('');
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
  const [elements, setElements] = useState<TextElement[]>([]);
  
  // A variável 'selectedElementId' foi removida por enquanto para evitar avisos.
  // Você pode adicioná-la de volta quando for construir o painel de propriedades.
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função para carregar a imagem de fundo no canvas
  useEffect(() => {
    if (backgroundImageUrl) {
      const img = new window.Image();
      img.src = backgroundImageUrl;
      img.onload = () => {
        setBackgroundImage(img);
      };
    }
  }, [backgroundImageUrl]);

  // Função para lidar com o upload do arquivo
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Falha no upload da imagem');
      }

      const data = await response.json();
      setBackgroundImageUrl(data.url); 
    } catch (error) {
      console.error(error);
      alert('Erro ao fazer upload da imagem.');
    }
  };

  // Função para adicionar um novo texto
  const handleAddText = () => {
    const newText: TextElement = {
      id: `text_${Date.now()}`,
      text: 'Texto Editável {titulo}',
      x: 50,
      y: 50,
      fontSize: 24,
      fill: '#000000',
    };
    setElements([...elements, newText]);
  };

  // Função para atualizar a posição do texto ao arrastar
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, id: string) => {
    const newElements = elements.slice();
    const element = newElements.find(el => el.id === id);
    if (element) {
      element.x = e.target.x();
      element.y = e.target.y();
      setElements(newElements);
    }
  };

  // Função para salvar o template completo
  const handleSaveTemplate = async () => {
    if (!templateName) {
      alert('Por favor, dê um nome ao template.');
      return;
    }
    if (!backgroundImageUrl) {
      alert('Por favor, envie uma imagem de fundo.');
      return;
    }

    try {
      const response = await fetch('/api/templates/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateName,
          backgroundImageUrl: backgroundImageUrl,
          elements: elements,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar o template');
      }

      alert('Template salvo com sucesso!');
      router.push('/integracoes'); 

    } catch (error) {
      console.error(error);
      alert('Erro ao salvar o template.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Painel de Controles (Esquerda) */}
      <div className="w-80 bg-white p-6 shadow-md overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Criar Template de Imagem</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome do Template</label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ex: Post para Instagram"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Imagem de Fundo</label>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {backgroundImageUrl ? 'Trocar Imagem' : 'Escolher Imagem'}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/png, image/jpeg"
            />
          </div>

          <button
            onClick={handleAddText}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Adicionar Texto
          </button>
          <div className='pt-4'>
            <p className="text-xs text-gray-500">Variáveis disponíveis:</p>
            {/* CORREÇÃO APLICADA AQUI */}
            <p className="text-xs text-gray-500">{'{titulo}'} - Título da vaga</p>
            <p className="text-xs text-gray-500">{'{descricao}'} - Descrição da vaga</p>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <button
            onClick={handleSaveTemplate}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Salvar Template
          </button>
        </div>
      </div>

      {/* Área do Editor (Direita) */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg">
          <Stage
            width={backgroundImage?.width || 800}
            height={backgroundImage?.height || 600}
            className="border"
          >
            <Layer>
              {backgroundImage && <KonvaImage image={backgroundImage} />}
              {elements.map((el) => (
                <KonvaText
                  key={el.id}
                  id={el.id}
                  text={el.text}
                  x={el.x}
                  y={el.y}
                  fontSize={el.fontSize}
                  fill={el.fill}
                  draggable
                  // A propriedade onClick foi removida daqui
                  onDragEnd={(e) => handleDragEnd(e, el.id)}
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}