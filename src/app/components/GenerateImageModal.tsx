// src/app/components/GenerateImageModal.tsx

'use client';

import { useState, useEffect } from 'react';
import { Vaga } from '@prisma/client';
import { Loader, Download, X, Image as ImageIcon } from 'lucide-react';

// Tipagem para os templates que virão da nossa nova API
interface ImageTemplate {
    id: string;
    name: string;
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
                    }
                })
                .catch(console.error)
                .finally(() => setIsLoading(false));
        } else {
            // Reseta o estado quando o modal fecha
            setGeneratedImageUrl(null);
            setSelectedTemplateId('');
        }
    }, [isOpen]);

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

    if (!isOpen || !vaga) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Gerar Imagem para: {vaga.titulo}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>

                {/* Área de resultado */}
                <div className="bg-gray-100 rounded-md min-h-[300px] flex items-center justify-center mb-6">
                    {isLoading && <Loader className="animate-spin" size={48} />}
                    {!isLoading && generatedImageUrl && (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={generatedImageUrl}
                                alt="Imagem gerada da vaga"
                                className="max-w-full max-h-[400px] rounded"
                                // Libera a memória do blob quando a imagem não for mais necessária
                                onLoad={() => URL.revokeObjectURL(generatedImageUrl)}
                            />
                        </>
                    )}
                    {!isLoading && !generatedImageUrl && (
                        <div className="text-center text-gray-500">
                            <ImageIcon size={48} className="mx-auto mb-2" />
                            <p>Selecione um template e clique em Gerar para visualizar a imagem.</p>
                        </div>
                    )}
                </div>

                {/* Controles */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <select
                        value={selectedTemplateId}
                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                        className="flex-grow block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={isLoading}
                    >
                        {templates.map(template => (
                            <option key={template.id} value={template.id}>
                                {template.name}
                            </option>
                        ))}
                    </select>

                    {generatedImageUrl ? (
                        <a
                            href={generatedImageUrl}
                            download={`vaga-${vaga.titulo}.png`}
                            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                        >
                            <Download size={20} className="mr-2" />
                            Download
                        </a>
                    ) : (
                        <button
                            onClick={handleGenerateImage}
                            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            disabled={isLoading || templates.length === 0}
                        >
                            {isLoading ? 'Gerando...' : 'Gerar'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}