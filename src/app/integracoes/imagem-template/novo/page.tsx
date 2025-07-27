'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Konva from 'konva';
import {
  Plus,
  Upload,
  Save,
  Type,
  Trash2,
  Edit3,
  Palette,
  Settings,
  Eye,
  Download,
  ArrowLeft,
  Info
} from 'lucide-react';

// CARREGAMENTO DINÂMICO: Importa o wrapper do editor apenas no lado do cliente
const TemplateEditorWrapper = dynamic(() => import('@/app/components/TemplateEditorWrapper'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-50 rounded-xl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Carregando editor...</p>
      </div>
    </div>
  ),
});

// Definindo o tipo para os nossos elementos de texto
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

export default function NovoTemplateDeImagemPage() {
  const router = useRouter();

  // Estados principais
  const [templateName, setTemplateName] = useState('');
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(null);
  const [elements, setElements] = useState<TextElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para o elemento selecionado
  const selectedElement = elements.find(el => el.id === selectedElementId);

  useEffect(() => {
    if (backgroundImageUrl) {
      const img = new window.Image();
      img.src = backgroundImageUrl;
      img.onload = () => {
        console.log('Imagem pronta para uso:', img);
        setBackgroundImage(img);
      };
    }
  }, [backgroundImageUrl]);

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

      if (!response.ok) throw new Error('Falha no upload da imagem');


      const data = await response.json();
      console.log('Upload URL:', data.url);
      console.log('URL completa:', window.location.origin + data.url);

      setBackgroundImageUrl(data.url);
    } catch (error) {
      console.error(error);
      alert('Erro ao fazer upload da imagem.');
    }
  };

  const handleAddText = () => {
    const newText: TextElement = {
      id: `text_${Date.now()}`,
      text: 'Novo Texto {titulo}',
      x: 100,
      y: 100,
      fontSize: 32,
      fill: '#1f2937',
      fontFamily: 'Arial',
      fontStyle: 'normal',
    };
    setElements([...elements, newText]);
    setSelectedElementId(newText.id);
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, id: string) => {
    setElements(currentElements =>
      currentElements.map(el =>
        el.id === id ? { ...el, x: e.target.x(), y: e.target.y() } : el
      )
    );
  };

  const handleElementClick = (id: string) => {
    setSelectedElementId(id);
  };

  const handleDeleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const handleUpdateElement = (id: string, updates: Partial<TextElement>) => {
    setElements(currentElements =>
      currentElements.map(el =>
        el.id === id ? { ...el, ...updates } : el
      )
    );
  };

  const handleSaveTemplate = async () => {
    if (!templateName || !backgroundImageUrl) {
      alert('Por favor, preencha o nome e envie uma imagem de fundo.');
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

      if (!response.ok) throw new Error('Falha ao salvar o template');

      alert('Template salvo com sucesso!');
      router.push('/integracoes');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar o template.');
    }
  };

  const handleExportImage = () => {
    // Funcionalidade para exportar a imagem
    console.log('Exportar imagem...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Editor de Template</h1>
                <p className="text-sm text-gray-500">Crie templates personalizados para suas vagas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${previewMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <Eye className="w-4 h-4" />
                {previewMode ? 'Sair do Preview' : 'Preview'}
              </button>
              <button
                onClick={handleExportImage}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <button
                onClick={handleSaveTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Salvar Template
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Painel de Controles (Esquerda) */}
        {!previewMode && (
          <div className="w-80 bg-white shadow-lg overflow-y-auto">
            {/* Configurações do Template */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Template
                  </label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Post para Instagram"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem de Fundo
                  </label>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">
                      {backgroundImageUrl ? 'Trocar Imagem' : 'Escolher Imagem'}
                    </span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/png, image/jpeg"
                  />
                </div>
              </div>
            </div>

            {/* Elementos de Texto */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Type className="w-5 h-5" />
                  Elementos de Texto
                </h2>
                <button
                  onClick={handleAddText}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar
                </button>
              </div>

              <div className="space-y-2">
                {elements.map((element) => (
                  <div
                    key={element.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedElementId === element.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    onClick={() => handleElementClick(element.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {element.text}
                        </p>
                        <p className="text-xs text-gray-500">
                          {element.fontSize}px • {element.fill}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedElementId(element.id);
                            setIsEditing(true);
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-3 h-3 text-gray-500" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteElement(element.id);
                          }}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {elements.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Type className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Nenhum elemento de texto</p>
                    <p className="text-xs">Clique em Adicionar para começar</p>
                  </div>
                )}
              </div>
            </div>

            {/* Editor de Propriedades */}
            {selectedElement && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Propriedades
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto
                    </label>
                    <textarea
                      value={selectedElement.text}
                      onChange={(e) => handleUpdateElement(selectedElement.id, { text: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Digite o texto..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tamanho
                      </label>
                      <input
                        type="number"
                        value={selectedElement.fontSize}
                        onChange={(e) => handleUpdateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="8"
                        max="200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cor
                      </label>
                      <input
                        type="color"
                        value={selectedElement.fill}
                        onChange={(e) => handleUpdateElement(selectedElement.id, { fill: e.target.value })}
                        className="w-full h-10 border border-gray-300 rounded-lg shadow-sm cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fonte
                    </label>
                    <select
                      value={selectedElement.fontFamily || 'Arial'}
                      onChange={(e) => handleUpdateElement(selectedElement.id, { fontFamily: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Courier New">Courier New</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estilo
                    </label>
                    <select
                      value={selectedElement.fontStyle || 'normal'}
                      onChange={(e) => handleUpdateElement(selectedElement.id, { fontStyle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Negrito</option>
                      <option value="italic">Itálico</option>
                      <option value="bold italic">Negrito Itálico</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Variáveis Disponíveis */}
            <div className="p-6 bg-blue-50 border-t">
              <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Variáveis Disponíveis
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <code className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                    {'{titulo}'}
                  </code>
                  <span className="text-xs text-blue-700">Título da vaga</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                    {'{descricao}'}
                  </code>
                  <span className="text-xs text-blue-700">Descrição da vaga</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                    {'{empresa}'}
                  </code>
                  <span className="text-xs text-blue-700">Nome da empresa</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Área do Editor (Centro/Direita) */}
        <div className="flex-1 p-8 flex items-center justify-center overflow-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <TemplateEditorWrapper
              backgroundImage={backgroundImage}
              elements={elements}
              selectedElementId={selectedElementId}
              onDragEnd={handleDragEnd}
              onElementClick={handleElementClick}
              onElementUpdate={handleUpdateElement}
              previewMode={previewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}