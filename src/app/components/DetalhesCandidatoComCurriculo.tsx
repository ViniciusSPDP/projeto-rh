'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import BotaoImprimir from '@/app/components/BotaoImprimir'
import { Candidatos } from '@prisma/client'
import {
    User, FileText, MapPin, Phone,
    Award, ChevronLeft, Clipboard, Instagram, Linkedin,
    Facebook, CheckCircle, XCircle, Edit, Clock, Plus,
    Mail, Calendar, UserCheck, Eye, MessageSquare
} from 'lucide-react'

import { Modal } from './Modal'
import ModalObservacao from './ModalObservacao'
import ModalAdicionarObservacao from './ModalAdicionarObservacao'
import ObservacaoItem from './ObservacaoItem'
import CurriculoViewer from './CurriculoViewer'

interface DetalhesCandidatoProps {
    candidato: Candidatos & {
        observacaoUpdatedAt?: Date | string | null;
    };
}

type ObservacaoHistorico = {
    id: number;
    observacao: string;
    createdAt: string;
    createdBy: string | null;
    updatedAt: string;
    updatedBy: string | null;
    isDeleted: boolean;
};

const InfoCard = ({ title, icon: Icon, children, className = "" }: {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                <Icon className="w-5 h-5" />
                {title}
            </h3>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const InfoItem = ({ label, value, icon: Icon, link }: {
    label: string;
    value: string | null | undefined;
    icon?: React.ElementType;
    link?: string;
}) => {
    if (!value || value.trim() === '') return null;
    
    const content = (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            {Icon && <Icon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="text-gray-900 font-medium break-words">{value}</p>
            </div>
        </div>
    );

    if (link) {
        return (
            <a href={link} target="_blank" rel="noopener noreferrer" className="block hover:scale-[1.01] transition-transform">
                {content}
            </a>
        );
    }

    return content;
};

export default function DetalhesCandidatoComCurriculo({ candidato }: DetalhesCandidatoProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [statusAtualizando, setStatusAtualizando] = useState<'Aprovado' | 'Reprovado' | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalAddOpen, setIsModalAddOpen] = useState(false)
    const [historicoObservacoes, setHistoricoObservacoes] = useState<ObservacaoHistorico[]>([])
    const [loadingHistorico, setLoadingHistorico] = useState(true)

    const carregarHistorico = useCallback(async () => {
        try {
            setLoadingHistorico(true)
            const response = await fetch(`/api/candidatos/${candidato.idCandidato}/observacao/historico`)
            if (response.ok) {
                const data = await response.json()
                setHistoricoObservacoes(data)
            }
        } catch (error) {
            console.error('Erro ao carregar histórico:', error)
        } finally {
            setLoadingHistorico(false)
        }
    }, [candidato.idCandidato])

    useEffect(() => {
        carregarHistorico()
    }, [carregarHistorico])

    const atualizarStatus = async (status: 'Aprovado' | 'Reprovado') => {
        setStatusAtualizando(status)
        await fetch(`/api/candidatos/${candidato.idCandidato}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        })

        startTransition(() => {
            setStatusAtualizando(null)
            router.refresh()
        })
    }

    const formatarData = (data: Date | string | null | undefined): string => {
        if (!data) return '—'
        return new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
    }

    const formatarDataHora = (data: Date | string | null | undefined): string => {
        if (!data) return '—'
        return new Date(data).toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusColor = (status: string | null) => {
        switch (status) {
            case 'Aprovado': return 'bg-green-100 text-green-800 border-green-200'
            case 'Reprovado': return 'bg-red-100 text-red-800 border-red-200'
            case 'Em análise': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    return (
        <>
            <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                            <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-xl shadow-lg">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Perfil do Candidato</h1>
                                    <p className="text-gray-600">Visualização completa com currículo</p>
                                </div>
                            </div>
                            <Link 
                                href="/candidatos" 
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Voltar para lista
                            </Link>
                        </div>

                        {/* Card do Candidato - Header Principal */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 px-8 py-6">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white/20 flex items-center justify-center border-4 border-white/30 shadow-lg">
                                            {candidato.fotoCandidato ? (
                                                <Image
                                                    src={candidato.fotoCandidato}
                                                    alt={candidato.nomeCandidato || 'Foto do candidato'}
                                                    layout="fill"
                                                    objectFit="cover"
                                                />
                                            ) : (
                                                <User className="w-10 h-10 text-white" />
                                            )}
                                        </div>
                                        
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-2">
                                                {candidato.nomeCandidato || 'Nome não informado'}
                                            </h2>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(candidato.situacaoCandidato)}`}>
                                                    {candidato.situacaoCandidato || 'Não definida'}
                                                </span>
                                                {candidato.vagainteresseCandidato && (
                                                    <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                                                        {candidato.vagainteresseCandidato}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:ml-auto text-right">
                                        <div className="flex items-center gap-2 text-blue-100 mb-1">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-sm">Cadastrado em:</span>
                                        </div>
                                        <p className="text-white font-medium">
                                            {formatarData(candidato.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {candidato.cidareacandidato && candidato.cidareacandidato.trim() !== '' && (
                                <div className="bg-amber-50 border-l-4 border-amber-400 px-6 py-3">
                                    <div className="flex items-center gap-2">
                                        <UserCheck className="w-5 h-5 text-amber-600" />
                                        <span className="text-amber-800 font-medium">
                                            Candidato PCD – CID informado: {candidato.cidareacandidato}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Layout Principal */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        
                        {/* Sidebar Esquerda - Informações do Candidato */}
                        <div className="xl:col-span-1 space-y-6">
                            
                            {/* Informações de Contato */}
                            <InfoCard title="Contato" icon={Phone}>
                                <div className="space-y-3">
                                    <InfoItem 
                                        label="Email" 
                                        value={candidato.emailCandidato} 
                                        icon={Mail}
                                        link={candidato.emailCandidato ? `mailto:${candidato.emailCandidato}` : undefined}
                                    />
                                    <InfoItem 
                                        label="Telefone Principal" 
                                        value={candidato.telefoneCandidato} 
                                        icon={Phone}
                                        link={candidato.telefoneCandidato ? `https://wa.me/55${candidato.telefoneCandidato.replace(/\D/g, '')}` : undefined}
                                    />
                                    <InfoItem 
                                        label="Telefone Secundário" 
                                        value={candidato.telefone2Candidato} 
                                        icon={Phone}
                                    />
                                </div>

                                {/* Redes Sociais */}
                                {(candidato.linkedinCandidato || candidato.facebookCandidato || candidato.instagramCandidato) && (
                                    <div className="mt-6 pt-4 border-t border-gray-200">
                                        <p className="text-sm font-medium text-gray-600 mb-3">Redes Sociais</p>
                                        <div className="flex flex-wrap gap-2">
                                            {candidato.linkedinCandidato && (
                                                <a href={candidato.linkedinCandidato} target="_blank" rel="noopener noreferrer" 
                                                   className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                                    <Linkedin className="w-4 h-4" /> LinkedIn
                                                </a>
                                            )}
                                            {candidato.facebookCandidato && (
                                                <a href={candidato.facebookCandidato} target="_blank" rel="noopener noreferrer" 
                                                   className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                                                    <Facebook className="w-4 h-4" /> Facebook
                                                </a>
                                            )}
                                            {candidato.instagramCandidato && (
                                                <a href={candidato.instagramCandidato} target="_blank" rel="noopener noreferrer" 
                                                   className="flex items-center gap-2 px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm">
                                                    <Instagram className="w-4 h-4" /> Instagram
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </InfoCard>

                            {/* Informações Pessoais */}
                            <InfoCard title="Dados Pessoais" icon={FileText}>
                                <div className="space-y-3">
                                    <InfoItem label="CPF" value={candidato.cpfCandidato} icon={FileText} />
                                    <InfoItem label="RG" value={candidato.rgCandidato} icon={FileText} />
                                    <InfoItem label="Data de Nascimento" value={formatarData(candidato.datanascimentoCandidato)} icon={Calendar} />
                                    <InfoItem label="Sexo" value={candidato.sexoCandidato || candidato.outrosexoCandidato} />
                                    <InfoItem label="Estado Civil" value={candidato.estadocivilCandidato} />
                                    <InfoItem label="CNH" value={candidato.cnhCandidato !== 'Não' && candidato.categoriacnhCandidato ? `${candidato.cnhCandidato} (${candidato.categoriacnhCandidato})` : candidato.cnhCandidato} />
                                </div>
                            </InfoCard>

                            {/* Endereço */}
                            {candidato.cepCandidato && (
                                <InfoCard title="Endereço" icon={MapPin}>
                                    <div className="space-y-3">
                                        <InfoItem label="CEP" value={candidato.cepCandidato} icon={MapPin} />
                                        <InfoItem label="Endereço" value={`${candidato.ruaCandidato || ''}, ${candidato.numeroCandidato || ''}`} />
                                        <InfoItem label="Bairro" value={candidato.bairroCandidato} />
                                        <InfoItem label="Cidade/UF" value={`${candidato.cidadeCandidato || ''} - ${candidato.estadoCandidato || ''}`} />
                                    </div>
                                </InfoCard>
                            )}

                            {/* Formação */}
                            {candidato.escolaridadeCandidato && (
                                <InfoCard title="Formação" icon={Award}>
                                    <div className="space-y-3">
                                        <InfoItem label="Escolaridade" value={candidato.escolaridadeCandidato} icon={Award} />
                                        {candidato.conhecimentosCandidato && (
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <p className="text-sm font-medium text-blue-700 mb-1">Diferencial</p>
                                                <p className="text-gray-700 text-sm">{candidato.conhecimentosCandidato}</p>
                                            </div>
                                        )}
                                    </div>
                                </InfoCard>
                            )}

                            {/* Ações Rápidas */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4">
                                    <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                                        <Clipboard className="w-5 h-5" />
                                        Ações
                                    </h3>
                                </div>
                                <div className="p-6 space-y-3">
                                    <Link 
                                        href={`/candidatos/editar/${candidato.idCandidato}`} 
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Editar Cadastro
                                    </Link>
                                    <BotaoImprimir id={Number(candidato.idCandidato)} />
                                </div>
                            </div>
                        </div>

                        {/* Área Principal - Currículo e Observações */}
                        <div className="xl:col-span-2 space-y-8">
                            
                            {/* Visualizador de Currículo */}
                            <InfoCard title="Currículo" icon={Eye} className="h-[842px]">
                                <div className="h-full w-full">
                                    <CurriculoViewer url={candidato.curriculoUrl} />
                                </div>
                            </InfoCard>

                            {/* Observações Internas */}
                            <InfoCard title="Observações Internas" icon={MessageSquare}>
                                <div className="space-y-6">
                                    {/* Header das Observações */}
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                {historicoObservacoes.length > 0
                                                    ? `${historicoObservacoes.length} observação(ões) registrada(s)`
                                                    : 'Nenhuma observação registrada'}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setIsModalAddOpen(true)}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm shadow-sm"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Adicionar
                                            </button>
                                            <button
                                                onClick={() => setIsModalOpen(true)}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-sm"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Editar Principal
                                            </button>
                                        </div>
                                    </div>

                                    {/* Observação Principal (legado) */}
                                    {candidato.observacaoCandidato && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                <p className="font-medium text-blue-800">Observação Principal</p>
                                            </div>
                                            <p className="text-gray-700 whitespace-pre-wrap mb-2">
                                                {candidato.observacaoCandidato}
                                            </p>
                                            {candidato.observacaoUpdatedAt && (
                                                <p className="text-xs text-gray-500 flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    Última atualização: {formatarDataHora(candidato.observacaoUpdatedAt)}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Histórico de Observações */}
                                    <div className="space-y-3">
                                        {loadingHistorico ? (
                                            <div className="text-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                                <p className="text-gray-500 mt-2">Carregando observações...</p>
                                            </div>
                                        ) : historicoObservacoes.length > 0 ? (
                                            historicoObservacoes.map((obs) => (
                                                <ObservacaoItem
                                                    key={obs.id}
                                                    observacao={obs}
                                                    onUpdate={carregarHistorico}
                                                />
                                            ))
                                        ) : (
                                            !candidato.observacaoCandidato && (
                                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                    <p className="italic text-gray-600 text-center">
                                                        Nenhuma observação adicionada. Clique em &ldquo;Adicionar&rdquo; para incluir uma observação.
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </InfoCard>

                            {/* Botões de Aprovação/Rejeição */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                                    <h3 className="text-white font-semibold text-lg">Decisão sobre Candidatura</h3>
                                </div>
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <button 
                                            disabled={isPending} 
                                            onClick={() => atualizarStatus('Aprovado')} 
                                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all disabled:bg-green-400 disabled:cursor-wait shadow-lg hover:shadow-xl"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            <span className="font-medium">
                                                {isPending && statusAtualizando === 'Aprovado' ? 'Processando...' : 'Aprovar Candidato'}
                                            </span>
                                        </button>
                                        <button 
                                            disabled={isPending} 
                                            onClick={() => atualizarStatus('Reprovado')} 
                                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:bg-red-400 disabled:cursor-wait shadow-lg hover:shadow-xl"
                                        >
                                            <XCircle className="w-5 h-5" />
                                            <span className="font-medium">
                                                {isPending && statusAtualizando === 'Reprovado' ? 'Processando...' : 'Rejeitar Candidato'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modais */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalObservacao
                    candidatoId={Number(candidato.idCandidato)}
                    initialObservacao={candidato.observacaoCandidato}
                    onSuccess={() => setIsModalOpen(false)}
                />
            </Modal>
            <Modal isOpen={isModalAddOpen} onClose={() => setIsModalAddOpen(false)}>
                <ModalAdicionarObservacao
                    candidatoId={Number(candidato.idCandidato)}
                    onSuccess={() => {
                        setIsModalAddOpen(false)
                        carregarHistorico()
                    }}
                />
            </Modal>
        </>
    )
}