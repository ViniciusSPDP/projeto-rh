// src/app/components/TemplateEditor.tsx

'use client';

import { Stage, Layer, Image as KonvaImage, Text as KonvaText } from 'react-konva';
import Konva from 'konva';

// Definindo os tipos para as props e elementos
interface TextElement {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fill: string;
}

interface TemplateEditorProps {
  backgroundImage: HTMLImageElement | null;
  elements: TextElement[];
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>, id: string) => void;
}

export default function TemplateEditor({
  backgroundImage,
  elements,
  onDragEnd,
}: TemplateEditorProps) {
  return (
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
              onDragEnd={(e) => onDragEnd(e, el.id)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}