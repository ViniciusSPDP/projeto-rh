// src/app/components/GenerateImageModal.tsx

'use client';

import { useState, useEffect } from 'react';
import { Vaga } from '@prisma/client'; // Supondo que esta tipagem venha do Prisma
import { Loader, Download, X, Image as ImageIcon } from 'lucide-react';

// Tipagem para os templates que virão da nossa API
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
    const [isFetchingTemplates, setIsFetchingTemplates] = useState(false);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Efeito para buscar a lista de templates quando o modal é aberto
    useEffect(() => {
        if (isOpen) {
            setIsFetchingTemplates(true);
            setError(null); // Limpa erros anteriores
            fetch('/api/templates/image')
                .then(res => {
                    if (!res.ok) throw new Error('Falha ao carregar os templates.');
                    return res.json();
                })
                .then((data: ImageTemplate[]) => {
                    setTemplates(data);
                    if (data.length > 0) {
                        setSelectedTemplateId(data[0].id); // Seleciona o primeiro por padrão
                    }
                })
                .catch(err => {
                    console.error(err);
                    if (err instanceof Error) {
                        setError('Não foi possível carregar os templates. Tente novamente.');
                    }
                })
                .finally(() => setIsFetchingTemplates(false));
        } else {
            // Reseta o estado quando o modal fecha para uma experiência limpa na próxima abertura
            setGeneratedImageUrl(null);
            setSelectedTemplateId('');
            setError(null);
        }
    }, [isOpen]);

    // Função para gerar a imagem da vaga
    const handleGenerateImage = async () => {
        if (!vaga || !selectedTemplateId) return;

        setIsLoading(true);
        setGeneratedImageUrl(null);
        setError(null);

        try {
            const response = await fetch(`/api/vagas/${vaga.idVaga}/generate-image?templateId=${selectedTemplateId}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Falha ao gerar a imagem' }));
                throw new Error(errorData.message || 'Falha ao gerar a imagem');
            }
            // Converte a resposta da imagem em uma URL de objeto para exibição no navegador
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            setGeneratedImageUrl(imageUrl);

        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocorreu um erro desconhecido ao gerar a imagem.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    // Libera a memória do blob quando o componente é desmontado ou a URL muda
    useEffect(() => {
        return () => {
            if (generatedImageUrl) {
                URL.revokeObjectURL(generatedImageUrl);
            }
        };
    }, [generatedImageUrl]);

    // Não renderiza nada se o modal não estiver aberto
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-white text-gray-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-200 transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
                {/* Cabeçalho do Modal */}
                <div className="flex items-start justify-between p-6 border-b border-gray-200/50">
                    <div className="space-y-1">
                        <h2 id="modal-title" className="text-2xl font-bold text-slate-800">
                            Gerador de Imagem de Vaga
                        </h2>
                        <p className="text-sm text-slate-600">
                            Para a vaga: <span className="font-semibold">{vaga?.titulo}</span>
                        </p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-colors"
                        aria-label="Fechar"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Corpo do Modal */}
                <div className="p-6">
                    {/* Área de Visualização da Imagem */}
                    <div className="bg-slate-100 rounded-lg min-h-[350px] flex items-center justify-center p-4 relative overflow-hidden">
                        {isLoading ? (
                            <div className="text-center text-blue-500">
                                <Loader className="animate-spin mx-auto" size={56} />
                                <p className="mt-4 font-semibold">Gerando sua imagem, aguarde...</p>
                            </div>
                        ) : generatedImageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={generatedImageUrl}
                                alt="Imagem gerada da vaga"
                                className="max-w-full max-h-[450px] object-contain rounded-md shadow-lg"
                            />
                        ) : (
                            <div className="text-center text-slate-500">
                                <ImageIcon size={56} className="mx-auto mb-4" />
                                <h3 className="font-semibold text-lg">Pronto para começar?</h3>
                                <p>Selecione um template abaixo e clique em &quot;Gerar Imagem&quot;.</p>
                            </div>
                        )}
                    </div>
                    
                    {error && (
                        <div className="mt-4 p-3 text-center bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Controles: Seleção de Template e Botões */}
                    <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-full flex-grow">
                             <label htmlFor="template-select" className="sr-only">Selecione um template</label>
                             <select
                                id="template-select"
                                value={selectedTemplateId}
                                onChange={(e) => setSelectedTemplateId(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
                                disabled={isLoading || isFetchingTemplates || templates.length === 0}
                            >
                                {isFetchingTemplates ? (
                                    <option>Carregando templates...</option>
                                ) : templates.length === 0 ? (
                                    <option>Nenhum template encontrado</option>
                                ) : (
                                    templates.map(template => (
                                        <option key={template.id} value={template.id}>
                                            {template.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                       
                        <div className="w-full sm:w-auto flex items-center gap-4">
                             {generatedImageUrl ? (
                                <a
                                    href={generatedImageUrl}
                                    download={`vaga-${vaga?.titulo.replace(/\s+/g, '-')}.png`}
                                    className="w-full sm:w-auto flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md transition-transform transform hover:scale-105"
                                >
                                    <Download size={20} className="mr-2" />
                                    Download
                                </a>
                            ) : (
                                <button
                                    onClick={handleGenerateImage}
                                    className="w-full sm:w-auto flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                                    disabled={isLoading || isFetchingTemplates || !selectedTemplateId}
                                >
                                    {isLoading ? 'Gerando...' : 'Gerar Imagem'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Adiciona um estilo para a animação de entrada */}
            <style jsx>{`
                @keyframes fade-in-scale {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
