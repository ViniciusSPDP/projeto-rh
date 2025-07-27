import Konva from 'konva';

// Tipos para os elementos de texto com área delimitada
export interface TextElement {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fill: string;
  fontFamily?: string;
  fontStyle?: string;
  
  // NOVAS PROPRIEDADES para área delimitada
  width?: number;           // Largura da área de texto
  height?: number;          // Altura da área de texto  
  align?: 'left' | 'center' | 'right';  // Alinhamento horizontal
  verticalAlign?: 'top' | 'middle' | 'bottom'; // Alinhamento vertical
  padding?: number;         // Padding interno da área
  wrap?: 'word' | 'char' | 'none'; // Tipo de quebra de linha
  
  // Controles visuais da área
  showBounds?: boolean;     // Mostrar bordas da área
  boundsColor?: string;     // Cor das bordas da área
}

// Props para o TemplateEditor
export interface TemplateEditorProps {
  backgroundImage: HTMLImageElement | null;
  elements: TextElement[];
  selectedElementId: string | null;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>, id: string) => void;
  onElementClick: (id: string) => void;
  onElementUpdate?: (id: string, updates: Partial<TextElement>) => void;
  previewMode?: boolean;
}