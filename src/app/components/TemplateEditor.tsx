'use client';

import { Stage, Layer, Image as KonvaImage, Text as KonvaText, Transformer, Rect } from 'react-konva';
import Konva from 'konva';
import { useRef, useEffect, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Definindo os tipos para as props e elementos
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

function TemplateEditor({
  backgroundImage,
  elements,
  selectedElementId,
  onDragEnd,
  onElementClick,
  onElementUpdate,
  previewMode = false,
}: TemplateEditorProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  // Função handleFitToScreen usando useCallback
  const handleFitToScreen = useCallback(() => {
    if (!backgroundImage || !containerSize.width || !containerSize.height) return;

    const scaleX = (containerSize.width - 100) / stageSize.width;
    const scaleY = (containerSize.height - 100) / stageSize.height;
    const newScale = Math.min(scaleX, scaleY, 1);
    
    setScale(newScale);
    
    // Centraliza
    const x = (containerSize.width - stageSize.width * newScale) / 2;
    const y = (containerSize.height - stageSize.height * newScale) / 2;
    setPosition({ x: Math.max(0, x), y: Math.max(0, y) });
  }, [backgroundImage, containerSize.width, containerSize.height, stageSize.width, stageSize.height]);

  // Atualiza o tamanho do container
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setContainerSize({ width: clientWidth, height: clientHeight });
      }
    };

    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    return () => window.removeEventListener('resize', updateContainerSize);
  }, []);

  // Atualiza o tamanho do stage baseado na imagem de fundo
  useEffect(() => {
    if (backgroundImage) {
      setStageSize({
        width: backgroundImage.width,
        height: backgroundImage.height,
      });
      // Auto-fit na primeira vez
      handleFitToScreen();
    }
  }, [backgroundImage, handleFitToScreen]);

  // Atualiza o transformer quando um elemento é selecionado
  useEffect(() => {
    if (selectedElementId && transformerRef.current && !previewMode) {
      const stage = stageRef.current;
      if (stage) {
        const selectedNode = stage.findOne(`#${selectedElementId}`) as Konva.Text;
        if (selectedNode) {
          transformerRef.current.nodes([selectedNode]);
          transformerRef.current.getLayer()?.batchDraw();
        }
      }
    } else if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedElementId, previewMode]);

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Se clicou no stage (fundo), deseleciona elementos
    if (e.target === e.target.getStage()) {
      onElementClick('');
    }
  };

  const handleTextClick = (e: Konva.KonvaEventObject<MouseEvent>, id: string) => {
    e.cancelBubble = true;
    if (!previewMode) {
      onElementClick(id);
    }
  };

  const handleTextTap = (e: Konva.KonvaEventObject<Event>, id: string) => {
    e.cancelBubble = true;
    if (!previewMode) {
      onElementClick(id);
    }
  };

  const handleTransform = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target as Konva.Text;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    
    // Mantém a proporção do texto
    node.scaleX(1);
    node.scaleY(1);
    
    // Aplica o novo tamanho baseado na escala
    const newFontSize = Math.max(8, node.fontSize() * Math.max(scaleX, scaleY));
    node.fontSize(newFontSize);

    // Atualiza o elemento no estado se houver callback
    if (onElementUpdate) {
      onElementUpdate(node.id(), { 
        fontSize: newFontSize,
        x: node.x(),
        y: node.y()
      });
    }
  };

  // Funções de zoom
  const handleZoomIn = () => {
    const newScale = Math.min(scale * 1.2, 5);
    setScale(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale / 1.2, 0.1);
    setScale(newScale);
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Função para lidar com o wheel (zoom com scroll)
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    
    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = Math.max(0.1, Math.min(5, oldScale + direction * 0.1));

    setScale(newScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    setPosition(newPos);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Controles de Zoom */}
      {!previewMode && (
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border p-2 flex flex-col gap-1">
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Zoom In (+ 20%)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Zoom Out (- 20%)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Reset Zoom (100%)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleFitToScreen}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Fit to Screen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border px-3 py-2 text-xs text-gray-600">
            {Math.round(scale * 100)}%
          </div>
        </div>
      )}

      {/* Indicador de modo preview */}
      {previewMode && (
        <div className="absolute top-4 left-4 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
          Modo Preview
        </div>
      )}

      {/* Informações do canvas */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md text-sm text-gray-600">
        <div>{stageSize.width} × {stageSize.height}px</div>
        {!previewMode && (
          <div className="text-xs text-gray-500 mt-1">
            Zoom: {Math.round(scale * 100)}%
          </div>
        )}
      </div>

      {/* Grid de fundo (apenas no modo edição) */}
      {!previewMode && !backgroundImage && (
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${20 * scale}px ${20 * scale}px`,
            backgroundPosition: `${position.x}px ${position.y}px`,
          }}
        />
      )}

      <div className="bg-white shadow-2xl rounded-xl overflow-hidden border-2 border-gray-100 w-full h-full">
        <Stage
          ref={stageRef}
          width={containerSize.width}
          height={containerSize.height}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          draggable={!previewMode}
          onClick={handleStageClick}
          onTap={handleStageClick}
          onWheel={handleWheel}
          className={previewMode ? "cursor-default" : "cursor-grab active:cursor-grabbing"}
        >
          <Layer>
            {/* Fundo colorido se não houver imagem */}
            {!backgroundImage && (
              <Rect
                width={stageSize.width}
                height={stageSize.height}
                fill="#f8fafc"
              />
            )}
            
            {/* Imagem de fundo */}
            {backgroundImage && (
              <KonvaImage 
                image={backgroundImage} 
                width={stageSize.width}
                height={stageSize.height}
              />
            )}
            
            {/* Elementos de texto */}
            {elements.map((el) => (
              <KonvaText
                key={el.id}
                id={el.id}
                text={el.text}
                x={el.x}
                y={el.y}
                fontSize={el.fontSize}
                fill={el.fill}
                fontFamily={el.fontFamily || 'Arial'}
                fontStyle={el.fontStyle || 'normal'}
                draggable={!previewMode}
                onClick={(e) => handleTextClick(e, el.id)}
                onTap={(e) => handleTextTap(e, el.id)}
                onDragEnd={(e) => onDragEnd(e, el.id)}
                onTransform={handleTransform}
                // Estilo visual para elemento selecionado
                stroke={selectedElementId === el.id && !previewMode ? '#3b82f6' : undefined}
                strokeWidth={selectedElementId === el.id && !previewMode ? 1 : 0}
                // Sombra sutil para melhor legibilidade
                shadowColor="rgba(0,0,0,0.1)"
                shadowBlur={2}
                shadowOffsetX={1}
                shadowOffsetY={1}
              />
            ))}
            
            {/* Transformer para redimensionar/rotacionar elementos */}
            {!previewMode && (
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  // Limita o tamanho mínimo
                  if (newBox.width < 20 || newBox.height < 10) {
                    return oldBox;
                  }
                  return newBox;
                }}
                // Configurações de aparência
                borderStroke="#3b82f6"
                borderStrokeWidth={2}
                borderDash={[5, 5]}
                anchorStroke="#3b82f6"
                anchorStrokeWidth={2}
                anchorFill="white"
                anchorSize={8}
                anchorCornerRadius={2}
                // Opções de transformação
                enabledAnchors={[
                  'top-left', 'top-right', 'bottom-left', 'bottom-right',
                  'top-center', 'bottom-center', 'middle-left', 'middle-right'
                ]}
                rotateEnabled={true}
                rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
                rotateAnchorOffset={30}
              />
            )}
          </Layer>
        </Stage>
      </div>

      {/* Instruções para o usuário */}
      {!previewMode && elements.length === 0 && !backgroundImage && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-gray-400 max-w-md">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium mb-2">Canvas Vazio</h3>
            <p className="text-sm">
              Adicione uma imagem de fundo e elementos de texto para começar a criar seu template
            </p>
          </div>
        </div>
      )}

      {/* Dicas de uso */}
      {!previewMode && elements.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 max-w-xs">
          <p className="font-medium mb-1">💡 Dicas:</p>
          <ul className="space-y-1">
            <li>• Arraste o canvas para mover</li>
            <li>• Use scroll para dar zoom</li>
            <li>• Arraste elementos para mover</li>
            <li>• Use as alças para redimensionar</li>
            <li>• Clique para selecionar e editar</li>
          </ul>
        </div>
      )}
    </div>
  );
}

// Exporta o componente com dynamic import para evitar problemas de SSR
export default dynamic(() => Promise.resolve(TemplateEditor), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-xl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando editor...</p>
      </div>
    </div>
  )
});

// Verificação se estamos no browser antes de usar Konva
if (typeof window !== 'undefined') {
  // Força o Konva a usar apenas funcionalidades do browser
  import('konva').then((Konva) => {
    // Configurações específicas do Konva para produção
    if (Konva.default) {
      Konva.default.pixelRatio = 1;
    }
  });
}