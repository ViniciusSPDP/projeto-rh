'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image' // 1. Importado o componente Image
import BotaoImprimir from '@/app/components/BotaoImprimir'
import { Candidatos } from '@prisma/client' // 2. Importado o tipo do Prisma
import {
    User, FileText, Briefcase, MapPin, Phone, // 'Mail' foi removido
    Award, ChevronLeft, Clipboard, Instagram, Linkedin,
    Facebook, CheckCircle, XCircle // Adicionado XCircle para o botão de rejeitar
} from 'lucide-react'

// 3. Definido o tipo das props
interface DetalhesCandidatoProps {
    candidato: Candidatos;
}

export default function DetalhesCandidato({ candidato }: DetalhesCandidatoProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [statusAtualizando, setStatusAtualizando] = useState<'Aprovado' | 'Reprovado' | null>(null)


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
        // Adicionado timeZone para evitar problemas de fuso horário entre servidor e cliente
        return new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 mb-4 sm:mb-0">
                        <div className="bg-blue-600 p-2 rounded-full">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-blue-800">Detalhes do Candidato</h1>
                    </div>
                    <Link href="/candidatos" className="flex items-center text-blue-700 hover:text-blue-900 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        <span>Voltar para lista</span>
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 mb-8">
                    <div className="bg-blue-700 text-white p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center border-2 border-blue-500">
                                {candidato.fotoCandidato ? (
                                    // 4. Substituído <img> por <Image>
                                    <Image
                                        src={candidato.fotoCandidato}
                                        alt={candidato.nomeCandidato || 'Foto do candidato'}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                ) : (
                                    <User className="w-8 h-8 text-white" />
                                )}
                            </div>

                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold">
                                    {candidato.nomeCandidato || '—'}
                                </h2>
                                <p className="text-blue-100 mt-1 flex items-center flex-wrap gap-2">
                                    <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-medium">
                                        {candidato.situacaoCandidato || 'Não definida'}
                                    </span>
                                    {candidato.vagainteresseCandidato && (
                                        <span className="text-sm">
                                            Vaga Interesse: {candidato.vagainteresseCandidato}
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="sm:ml-auto text-sm text-right">
                                <p className='text-blue-100'>Cadastrado em:</p>
                                <p className="font-medium text-blue-100">
                                    {formatarData(candidato.created_at)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {candidato.cidareacandidato && candidato.cidareacandidato.trim() !== '' && (
                        <div className="bg-blue-100 text-blue-800 text-sm px-4 py-2 font-medium border-b border-blue-300">
                            Candidato PCD – CID informado: {candidato.cidareacandidato}
                        </div>
                    )}

                    <div className="p-4 sm:p-6">
                        <section className="mb-8">
                            <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-100 pb-2 mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                                Informações Pessoais
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                                <div><p className="text-blue-500 text-sm font-medium">Nome</p><p className="font-medium">{candidato.nomeCandidato || '—'}</p></div>
                                <div><p className="text-blue-500 text-sm font-medium">CPF</p><p>{candidato.cpfCandidato || '—'}</p></div>
                                <div><p className="text-blue-500 text-sm font-medium">RG</p><p>{candidato.rgCandidato || '—'}</p></div>
                                <div><p className="text-blue-500 text-sm font-medium">Data de Nascimento</p><p>{formatarData(candidato.datanascimentoCandidato)}</p></div>
                                <div><p className="text-blue-500 text-sm font-medium">Sexo</p><p>{candidato.sexoCandidato || candidato.outrosexoCandidato || '—'}</p></div>
                                <div><p className="text-blue-500 text-sm font-medium">Estado Civil</p><p>{candidato.estadocivilCandidato || '—'}</p></div>
                                <div><p className="text-blue-500 text-sm font-medium">CNH</p><p>{candidato.cnhCandidato || '—'}{' '}{candidato.cnhCandidato !== 'Não' && candidato.categoriacnhCandidato ? `(${candidato.categoriacnhCandidato})` : ''}</p></div>
                                <div><p className="text-blue-500 text-sm font-medium">Parentesco</p><p>{candidato.parentescoCandidato}</p></div>
                                {candidato.graudeparentescoenomeCandidato && (<div><p className="text-blue-500 text-sm font-medium">Grau de Parentesco</p><p>{candidato.graudeparentescoenomeCandidato}</p></div>)}
                            </div>
                        </section>

                        <section className="mb-8">
                            <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-100 pb-2 mb-4 flex items-center">
                                <Phone className="w-5 h-5 mr-2 text-blue-600" />
                                Contato
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                                <div><p className="text-blue-500 text-sm font-medium">Email</p><p>{candidato.emailCandidato || '—'}</p></div>
                                <div>
                                    <p className="text-blue-500 text-sm font-medium">Telefone Principal</p>
                                    <p>{candidato.telefoneCandidato || '—'}</p>
                                    {candidato.telefoneCandidato && (
                                        <a
                                            href={`https://wa.me/55${candidato.telefoneCandidato.replace(/\D/g, '')}`}
                                            target="_blank" rel="noopener noreferrer"
                                            className="mt-2 inline-flex items-center gap-2 text-green-600 hover:text-green-700">
                                            {/* 5. Substituído <img> por <Image> */}
                                            <Image
                                                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                                                alt="WhatsApp"
                                                width={20}
                                                height={20}
                                            />
                                            Conversar no WhatsApp
                                        </a>
                                    )}
                                </div>
                                <div><p className="text-blue-500 text-sm font-medium">Telefone Secundário</p><p>{candidato.telefone2Candidato || '—'}</p></div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-3">
                                {candidato.linkedinCandidato && (<a href={candidato.linkedinCandidato} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-md"><Linkedin className="w-4 h-4" /> LinkedIn</a>)}
                                {candidato.facebookCandidato && (<a href={candidato.facebookCandidato} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-md"><Facebook className="w-4 h-4" /> Facebook</a>)}
                                {candidato.instagramCandidato && (<a href={candidato.instagramCandidato} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-md"><Instagram className="w-4 h-4" /> Instagram</a>)}
                            </div>
                        </section>

                        <section className="mb-8">
                            <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-100 pb-2 mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-blue-600" /> Endereço
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                                <div><p className="text-blue-500 text-sm font-medium">CEP</p><p>{candidato.cepCandidato || '—'}</p></div>
                                <div><p className="text-blue-500 text-sm font-medium">Rua</p><p>{candidato.ruaCandidato || '—'}</p></div>
                                <div><p className="text-blue-500 text-sm font-medium">Número</p><p>{candidato.numeroCandidato || '—'}</p></div>
                                <div><p className="text-blue-500 text-sm font-medium">Bairro</p><p>{candidato.bairroCandidato || '—'}</p></div>
                                <div><p className="text-blue-500 text-sm font-medium">Cidade</p><p>{candidato.cidadeCandidato || '—'}</p></div>
                                <div><p className="text-blue-500 text-sm font-medium">Estado</p><p>{candidato.estadoCandidato || '—'}</p></div>
                            </div>
                        </section>
                        
                        <section className="mb-8">
                             <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-100 pb-2 mb-4 flex items-center">
                                <Award className="w-5 h-5 mr-2 text-blue-600" /> Formação e Conhecimentos
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                                <div><p className="text-blue-500 text-sm font-medium">Escolaridade</p><p>{candidato.escolaridadeCandidato || '—'}</p></div>
                            </div>
                            <div className="mt-4"><p className="text-blue-500 text-sm font-medium">Diferencial</p><p className="bg-blue-50 p-3 rounded-md mt-1">{candidato.conhecimentosCandidato || '—'}</p></div>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                                <div><p className="text-blue-500 text-sm font-medium">Word</p><p>{candidato.wordCandidato || '—'}</p></div>
                                <div><p className="text-blue-500 text-sm font-medium">Excel</p><p>{candidato.excelCandidato || '—'}</p></div>
                                <div><p className="text-blue-500 text-sm font-medium">PowerPoint</p><p>{candidato.powerpointCandidato || '—'}</p></div>
                                <div><p className="text-blue-500 text-sm font-medium">Conhecimentos Programas</p><p>{candidato.conhecimentosinformaticaCandidato || '—'}</p></div>
                            </div>
                            <div className="mt-4"><p className="text-blue-500 text-sm font-medium">Outros Conhecimentos de Informática</p><p className="bg-blue-50 p-3 rounded-md mt-1">{candidato.conhecimentoinfcandidato || '—'}</p></div>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-100 pb-2 mb-4 flex items-center">
                                <Briefcase className="w-5 h-5 mr-2 text-blue-600" /> Experiências Profissionais
                            </h3>
                            <div className="space-y-6">
                                {candidato.empresaCandidato && (<div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600"><div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2"><h4 className="font-semibold text-blue-800">{candidato.empresaCandidato}</h4><div className="text-blue-600 text-sm">{formatarData(candidato.datainicioCandidato)} -{candidato.trabalha1Candidato === 'Sim' ? ' Atual' : ` ${formatarData(candidato.datafinalCandidato)}`}</div></div><p className="text-sm text-blue-700 mb-1">{candidato.local1Candidato || '—'}</p><p className="mt-2 text-sm text-blue-500">{candidato.atividadesdesenvolvidas1Candidato || '—'}</p></div>)}
                                {candidato.empresa2Candidato && (<div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500"><div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2"><h4 className="font-semibold text-blue-800">{candidato.empresa2Candidato}</h4><div className="text-blue-600 text-sm">{formatarData(candidato.datainicio2Candidato)} -{candidato.trabalha2Candidato === 'Sim' ? ' Atual' : ` ${formatarData(candidato.datafinal2Candidato)}`}</div></div><p className="text-sm text-blue-700 mb-1">{candidato.local2Candidato || '—'}</p><p className="mt-2 text-sm text-blue-500">{candidato.atividadesdesenvolvidas2Candidato || '—'}</p></div>)}
                                {candidato.empresa3Candidato && (<div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400"><div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2"><h4 className="font-semibold text-blue-800">{candidato.empresa3Candidato}</h4><div className="text-blue-600 text-sm">{formatarData(candidato.datainicio3Candidato)} -{candidato.trabalha3Candidato === 'Sim' ? ' Atual' : ` ${formatarData(candidato.datafinal3Candidato)}`}</div></div><p className="text-sm text-blue-700 mb-1">{candidato.local3Candidato || '—'}</p><p className="mt-2 text-sm text-blue-500">{candidato.atividadesdesenvolvidas3Candidato || '—'}</p></div>)}
                                {!candidato.empresaCandidato && !candidato.empresa2Candidato && !candidato.empresa3Candidato && (<p className="text-gray-500 italic">Nenhuma experiência profissional registrada</p>)}
                            </div>
                        </section>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center sm:justify-between gap-3 mb-6">
                    <div className="flex gap-2">
                        <Link href={`/candidatos/editar/${candidato.idCandidato}`} className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            <Clipboard className="w-4 h-4 mr-2" /> Editar Candidato
                        </Link>
                        <BotaoImprimir id={candidato.idCandidato} />
                    </div>
                    <div className="flex gap-2">
                        <button disabled={isPending} onClick={() => atualizarStatus('Aprovado')} className={`inline-flex cursor-pointer items-center px-4 py-2 rounded-md text-white transition-colors disabled:cursor-wait disabled:bg-green-400 bg-green-600 hover:bg-green-700`}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {isPending && statusAtualizando === 'Aprovado' ? 'Aguarde...' : 'Aprovar'}
                        </button>
                        <button disabled={isPending} onClick={() => atualizarStatus('Reprovado')} className={`inline-flex items-center cursor-pointer px-4 py-2 rounded-md text-white transition-colors disabled:cursor-wait disabled:bg-red-400 bg-red-600 hover:bg-red-700`}>
                            <XCircle className="w-4 h-4 mr-2" />
                            {isPending && statusAtualizando === 'Reprovado' ? 'Aguarde...' : 'Rejeitar'}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}
