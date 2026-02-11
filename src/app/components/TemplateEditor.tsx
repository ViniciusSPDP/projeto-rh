'use client';

import { Stage, Layer, Image as KonvaImage, Text as KonvaText, Rect, Group } from 'react-konva';
import Konva from 'konva';
import { useRef, useEffect, useState, useCallback } from 'react'; // Adicionado useCallback
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';

// Import dos tipos
import { TextElement, TemplateEditorProps } from '@/types/types';

export default function TemplateEditor({
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

  // Função para quebrar texto em linhas dentro da largura especificada
  const wrapText = (text: string, maxWidth: number, fontSize: number, fontFamily: string): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    // Criar um elemento temporário para medir o texto
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return [text];
    
    tempCtx.font = `${fontSize}px ${fontFamily}`;

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = tempCtx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines.length > 0 ? lines : [text];
  };

  // Função para calcular a posição Y baseada no alinhamento vertical
  const calculateVerticalOffset = (
    element: TextElement, 
    totalTextHeight: number
  ): number => {
    const height = element.height || 100;
    const padding = element.padding || 10;
    const availableHeight = height - (padding * 2);
    
    switch (element.verticalAlign) {
      case 'middle':
        return (availableHeight - totalTextHeight) / 2;
      case 'bottom':
        return availableHeight - totalTextHeight;
      case 'top':
      default:
        return 0;
    }
  };

  // --- CORREÇÃO 1: useCallback para handleFitToScreen para resolver o warning do useEffect ---
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
  }, [backgroundImage, containerSize, stageSize]);

  // Componente para renderizar texto com área delimitada FIXA
  const TextWithBounds = ({ element }: { element: TextElement }) => {
    const width = element.width || 300;
    const height = element.height || 100;
    const padding = element.padding || 10;
    const showBounds = element.showBounds !== false; // default true
    const boundsColor = element.boundsColor || '#3b82f6';

    // Quebrar o texto em linhas
    const maxTextWidth = width - (padding * 2);
    const lines = wrapText(
      element.text, 
      maxTextWidth, 
      element.fontSize, 
      element.fontFamily || 'Arial'
    );

    // Calcular altura total do texto
    const lineHeight = element.fontSize * 1.2; // 120% do tamanho da fonte
    const totalTextHeight = lines.length * lineHeight;

    // Calcular offset vertical
    const verticalOffset = calculateVerticalOffset(element, totalTextHeight);

    return (
      <Group
        x={element.x}
        y={element.y}
        draggable={!previewMode}
        onDragStart={(e) => {
          console.log('Drag iniciado:', element.id , 'Posição inicial:', e.target.x(), e.target.y());
          // Mudar cursor para indicar movimento
          if (stageRef.current) {
            stageRef.current.container().style.cursor = 'move';
          }
        }}
        onDragEnd={(e) => {
          console.log('Drag finalizado:', element.id, 'Nova posição:', e.target.x(), e.target.y());
          onDragEnd(e, element.id);
          // Restaurar cursor
          if (stageRef.current) {
            stageRef.current.container().style.cursor = 'grab';
          }
        }}
        onClick={(e) => {
          e.cancelBubble = true;
          if (!previewMode) {
            console.log('Clicou no elemento:', element.id);
            onElementClick(element.id);
            
            // DESABILITAR drag do canvas quando elemento está selecionado
            if (stageRef.current) {
              stageRef.current.draggable(false);
            }
          }
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          if (!previewMode) {
            onElementClick(element.id);
            
            // DESABILITAR drag do canvas quando elemento está selecionado
            if (stageRef.current) {
              stageRef.current.draggable(false);
            }
          }
        }}
        onMouseEnter={() => {
          // Cursor pointer quando passa sobre elemento
          if (stageRef.current && !previewMode) {
            stageRef.current.container().style.cursor = 'pointer';
          }
        }}
        onMouseLeave={() => {
          // Voltar cursor normal
          if (stageRef.current && !previewMode) {
            stageRef.current.container().style.cursor = selectedElementId ? 'default' : 'grab';
          }
        }}
      >
        {/* ÚNICA ÁREA DELIMITADA (retângulo de fundo) */}
        {showBounds && !previewMode && (
          <Rect
            width={width}
            height={height}
            fill="rgba(59, 130, 246, 0.1)"
            stroke={boundsColor}
            strokeWidth={selectedElementId === element.id ? 2 : 1}
            dash={selectedElementId === element.id ? [5, 5] : [2, 2]}
            cornerRadius={4}
            listening={true} // PERMITIR CLIQUES na área para selecionar/arrastar
          />
        )}

        {/* Renderizar cada linha de texto DENTRO da área fixa */}
        {lines.map((line, index) => {
          const textY = padding + verticalOffset + (index * lineHeight);
          
          // CORRIGIR ALINHAMENTO: Calcular posição X correta
          let textX: number;
          let konvaAlign: 'left' | 'center' | 'right' = 'left';
          
          if (element.align === 'center') {
            textX = padding; // Começar do padding
            konvaAlign = 'center';
          } else if (element.align === 'right') {
            textX = padding; // Começar do padding
            konvaAlign = 'right';
          } else {
            textX = padding; // Começar do padding (left é default)
            konvaAlign = 'left';
          }

          return (
            <KonvaText
              key={`${element.id}-line-${index}`}
              text={line}
              x={textX}
              y={textY}
              fontSize={element.fontSize}
              fill={element.fill}
              fontFamily={element.fontFamily || 'Arial'}
              fontStyle={element.fontStyle || 'normal'}
              align={konvaAlign}
              width={maxTextWidth} // SEMPRE definir largura para alinhamento funcionar
              // Sombra sutil para melhor legibilidade
              shadowColor="rgba(0,0,0,0.1)"
              shadowBlur={2}
              shadowOffsetX={1}
              shadowOffsetY={1}
              // Desabilitar eventos para não interferir com o drag do grupo
              listening={false}
            />
          );
        })}

        {/* Handle de redimensionamento APENAS quando selecionado */}
        {selectedElementId === element.id && !previewMode && (
          <>
            {/* Canto inferior direito para redimensionar a ÁREA */}
            <Rect
              x={width - 10}
              y={height - 10}
              width={10}
              height={10}
              fill={boundsColor}
              stroke="white"
              strokeWidth={1}
              cornerRadius={2}
              draggable
              onDragMove={(e) => {
                const dragX = e.target.x();
                const dragY = e.target.y();
                
                const newWidth = Math.max(80, dragX + 10);
                const newHeight = Math.max(40, dragY + 10);
                
                if (onElementUpdate) {
                  onElementUpdate(element.id, {
                    width: newWidth,
                    height: newHeight
                  });
                }
              }}
              onDragEnd={(e) => {
                // Reset position of the resize handle
                e.target.x(width - 10);
                e.target.y(height - 10);
              }}
              listening={true} // Este pode escutar eventos
            />
            
            {/* Indicador de tamanho da área */}
            <KonvaText
              x={width + 15}
              y={height - 15}
              text={`${width}×${height}px`}
              fontSize={11}
              fill="#666"
              fontFamily="Arial"
              listening={false}
              opacity={0.8}
            />
            
            {/* Indicador de alinhamento */}
            <KonvaText
              x={5}
              y={-20}
              text={`📍 ${element.align || 'left'}`}
              fontSize={10}
              fill={boundsColor}
              fontFamily="Arial"
              listening={false}
              opacity={0.9}
            />
          </>
        )}
      </Group>
    );
  };

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

  // Atualiza o tamanho do stage baseado na imagem de fundo e faz auto-fit
  useEffect(() => {
    if (backgroundImage) {
      setStageSize({
        width: backgroundImage.width,
        height: backgroundImage.height,
      });
      // Auto-fit na primeira vez
      handleFitToScreen();
    }
    // Adicionamos handleFitToScreen na dependência (agora que é useCallback)
  }, [backgroundImage, containerSize, handleFitToScreen]); 

  // Atualiza o transformer quando um elemento é selecionado (DESABILITADO)
  useEffect(() => {
    // Desabilitar transformer pois agora usamos apenas drag + resize handle
    if (transformerRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedElementId, previewMode]);

  // --- CORREÇÃO 2: Tipagem correta para suportar MouseEvent OU TouchEvent ---
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    // Se clicou no stage (fundo), deseleciona elementos E permite arrastar canvas
    if (e.target === e.target.getStage()) {
      console.log('Clicou no fundo - deselecionando e habilitando drag do canvas');
      onElementClick(''); // Deseleciona elemento
      
      // Habilitar drag do canvas
      if (stageRef.current) {
        stageRef.current.draggable(true);
      }
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
          draggable={!previewMode && selectedElementId === null} // SÓ ARRASTAR CANVAS SE NENHUM ELEMENTO ESTIVER SELECIONADO
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
            
            {/* Elementos de texto com área delimitada FIXA */}
            {elements.map((element) => (
              <TextWithBounds key={element.id} element={element} />
            ))}
            
            {/* Transformer REMOVIDO - usamos apenas drag + resize handle */}
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

      {/* Dicas de uso atualizadas */}
      {!previewMode && elements.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 max-w-xs">
          <p className="font-medium mb-1">💡 Dicas:</p>
          <ul className="space-y-1">
            <li>• Arraste o canvas para mover</li>
            <li>• Use scroll para dar zoom</li>
            <li>• Arraste áreas de texto para mover</li>
            <li>• Use o quadrado azul para redimensionar a ÁREA</li>
            <li>• Texto se alinha DENTRO da área fixa</li>
            <li>• Configure alinhamento no painel lateral</li>
          </ul>
        </div>
      )}
    </div>
  );
}