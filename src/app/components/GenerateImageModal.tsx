// src/app/components/GenerateImageModal.tsx

'use client';

import { useState, useEffect } from 'react';
import { Vaga } from '@prisma/client';
import { Loader, Download, X, Image as ImageIcon, Sparkles } from 'lucide-react';

// Tipagem para os templates que virão da nossa nova API
interface ImageTemplate {
    id: string;
    name: string;
    format: 'story' | 'post' | 'banner'; // Adiciona formato do template
    dimensions: {
        width: number;
        height: number;
    };
}

interface GenerateImageModalProps {
    vaga: Vaga | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function GenerateImageModal({ vaga, isOpen, onClose }: GenerateImageModalProps) {
    const [templates, setTemplates] = useState<ImageTemplate[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<ImageTemplate | null>(null);

    // Busca a lista de templates quando o modal abre
    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            fetch('/api/templates/image')
                .then(res => res.json())
                .then((data: ImageTemplate[]) => {
                    setTemplates(data);
                    // Seleciona o primeiro template por padrão
                    if (data.length > 0) {
                        setSelectedTemplateId(data[0].id);
                        setSelectedTemplate(data[0]);
                    }
                })
                .catch(console.error)
                .finally(() => setIsLoading(false));
        } else {
            // Reseta o estado quando o modal fecha
            setGeneratedImageUrl(null);
            setSelectedTemplateId('');
            setSelectedTemplate(null);
        }
    }, [isOpen]);

    const handleTemplateChange = (templateId: string) => {
        setSelectedTemplateId(templateId);
        const template = templates.find(t => t.id === templateId);
        setSelectedTemplate(template || null);
        // Limpa a imagem gerada quando muda o template
        setGeneratedImageUrl(null);
    };

    const handleGenerateImage = async () => {
        if (!vaga || !selectedTemplateId) return;

        setIsLoading(true);
        setGeneratedImageUrl(null);

        try {
            const response = await fetch(`/api/vagas/${vaga.idVaga}/generate-image?templateId=${selectedTemplateId}`);
            if (!response.ok) {
                throw new Error('Falha ao gerar a imagem');
            }
            // Converte a resposta da imagem em uma URL que o navegador pode exibir
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            setGeneratedImageUrl(imageUrl);

        } catch (error) {
            console.error(error);
            alert('Erro ao gerar imagem.');
        } finally {
            setIsLoading(false);
        }
    };

    // Função para calcular dimensões da preview baseada no formato
    const getPreviewDimensions = () => {
        if (!selectedTemplate) return { width: 300, height: 200 };
        
        const { width, height } = selectedTemplate.dimensions;
        const aspectRatio = width / height;
        
        // Limita a altura máxima para diferentes formatos
        const maxHeight = selectedTemplate.format === 'story' ? 400 : 300;
        const maxWidth = selectedTemplate.format === 'story' ? 225 : 400;
        
        if (aspectRatio > 1) {
            // Landscape
            return {
                width: Math.min(maxWidth, width),
                height: Math.min(maxWidth / aspectRatio, maxHeight)
            };
        } else {
            // Portrait ou quadrado
            return {
                width: Math.min(maxHeight * aspectRatio, maxWidth),
                height: Math.min(maxHeight, height)
            };
        }
    };

    const previewDimensions = getPreviewDimensions();

    if (!isOpen || !vaga) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Sparkles className="text-yellow-300" size={24} />
                                Gerar Imagem
                            </h2>
                            <p className="text-blue-100 mt-1 font-medium">{vaga.titulo}</p>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Template Selection */}
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700">
                            Selecione um Template
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {templates.map(template => (
                                <button
                                    key={template.id}
                                    onClick={() => handleTemplateChange(template.id)}
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                                        selectedTemplateId === template.id
                                            ? 'border-blue-500 bg-blue-50 shadow-md'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                    disabled={isLoading}
                                >
                                    <div className="font-medium text-gray-900">{template.name}</div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {template.format === 'story' && '📱 Story (9:16)'}
                                        {template.format === 'post' && '🖼️ Post (1:1)'}
                                        {template.format === 'banner' && '🎯 Banner (16:9)'}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700">
                            Preview
                        </label>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 min-h-[300px] flex items-center justify-center relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(0,0,0)_1px,transparent_0)] bg-[length:20px_20px]"></div>
                            </div>
                            
                            {isLoading && (
                                <div className="flex flex-col items-center gap-4 text-gray-600">
                                    <Loader className="animate-spin text-blue-500" size={48} />
                                    <p className="font-medium">Gerando sua imagem...</p>
                                </div>
                            )}
                            
                            {!isLoading && generatedImageUrl && (
                                <div className="relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={generatedImageUrl}
                                        alt="Imagem gerada da vaga"
                                        className="rounded-lg shadow-lg"
                                        style={{
                                            width: `${previewDimensions.width}px`,
                                            height: `${previewDimensions.height}px`,
                                            objectFit: 'contain'
                                        }}
                                        onLoad={() => URL.revokeObjectURL(generatedImageUrl)}
                                    />
                                    
                                    {/* Format Badge */}
                                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                        {selectedTemplate?.format.toUpperCase()}
                                    </div>
                                </div>
                            )}
                            
                            {!isLoading && !generatedImageUrl && (
                                <div className="text-center text-gray-500 max-w-md">
                                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ImageIcon size={32} className="text-gray-400" />
                                    </div>
                                    <h3 className="font-semibold text-lg text-gray-700 mb-2">
                                        Pronto para gerar!
                                    </h3>
                                    <p className="text-sm">
                                        Clique em &quot;Gerar Imagem&quot; para criar uma visualização personalizada da sua vaga.
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        {/* Template Info */}
                        {selectedTemplate && (
                            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">
                                        <strong>Formato:</strong> {selectedTemplate.format}
                                    </span>
                                    <span className="text-gray-600">
                                        <strong>Dimensões:</strong> {selectedTemplate.dimensions.width}x{selectedTemplate.dimensions.height}px
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        
                        {generatedImageUrl ? (
                            <a
                                href={generatedImageUrl}
                                download={`${vaga.titulo}-${selectedTemplate?.format || 'imagem'}.png`}
                                className="flex-1 flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors shadow-lg"
                            >
                                <Download size={20} className="mr-2" />
                                Download da Imagem
                            </a>
                        ) : (
                            <button
                                onClick={handleGenerateImage}
                                className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading || templates.length === 0}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader className="animate-spin mr-2" size={20} />
                                        Gerando...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2" size={20} />
                                        Gerar Imagem
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}