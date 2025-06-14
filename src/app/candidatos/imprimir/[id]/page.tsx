import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import BotaoPrint from '@/app/components/BotaoPrint'
import Image from 'next/image' // 1. Importar o componente Image
import {
    Briefcase, MapPin, Phone, Mail, Award,
    GraduationCap, Globe, Terminal, Check, Car
} from 'lucide-react'
import { Candidatos } from '@prisma/client'

interface ImprimirCurriculoPageProps {
    params: {
        id: string;
    }
}

export default async function ImprimirCurriculoPage({ params }: ImprimirCurriculoPageProps) {
    const id = Number(params.id)

    if (isNaN(id)) return notFound()

    const candidato: Candidatos | null = await prisma.candidatos.findUnique({
        where: { idCandidato: id },
    })

    if (!candidato) return notFound()

    function formatarData(data: string | Date | null) {
        if (!data) return '—'
        return new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) // Adicionado timeZone para consistência
    }

    function calcularIdade(dataNascimento: string | Date | null) {
        if (!dataNascimento) return null
        const hoje = new Date()
        const nascimento = new Date(dataNascimento)
        let idade = hoje.getFullYear() - nascimento.getFullYear()
        const m = hoje.getMonth() - nascimento.getMonth()
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--
        }
        return idade
    }

    const idade = calcularIdade(candidato.datanascimentoCandidato)

    return (
        <main className="bg-white min-h-screen p-8 print:p-4 max-w-[210mm] mx-auto">
            <div className="print:hidden mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-800">Visualização de Impressão</h1>
                <BotaoPrint />
            </div>

            <div className="print:block">
                <header className="flex justify-between items-start mb-6 border-b border-gray-300 pb-4">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-blue-800">{candidato.nomeCandidato || '—'}</h1>

                        <div className="mt-2 text-sm space-y-1">
                            {candidato.sexoCandidato && idade !== null && (
                                <p className="text-gray-700">
                                    {candidato.sexoCandidato}, {idade} anos
                                </p>
                            )}

                            <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-blue-600" />
                                <span className="text-gray-700">
                                    {[
                                        candidato.bairroCandidato,
                                        candidato.cidadeCandidato,
                                        candidato.estadoCandidato
                                    ].filter(Boolean).join(', ')}
                                </span>
                            </div>

                            {candidato.emailCandidato && (
                                <div className="flex items-center gap-1">
                                    <Mail className="w-3 h-3 text-blue-600" />
                                    <span className="text-gray-700">{candidato.emailCandidato}</span>
                                </div>
                            )}

                            {candidato.telefoneCandidato && (
                                <div className="flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-blue-600" />
                                    <span className="text-gray-700">{candidato.telefoneCandidato}</span>
                                </div>
                            )}

                            {candidato.cnhCandidato && candidato.cnhCandidato !== 'Não' && (
                                <div className="flex items-center gap-1">
                                    <Car className="w-3 h-3 text-blue-600" />
                                    <span className="text-gray-700">
                                        CNH {candidato.categoriacnhCandidato || ''}
                                    </span>
                                </div>
                            )}
                        </div>

                        {(candidato.linkedinCandidato || candidato.instagramCandidato) && (
                            <div className="mt-2 text-sm flex flex-wrap gap-3">
                                {candidato.linkedinCandidato && (
                                    <div className="flex items-center gap-1">
                                        <Globe className="w-3 h-3 text-blue-600" />
                                        <span className="text-gray-700">LinkedIn</span>
                                    </div>
                                )}
                                {candidato.instagramCandidato && (
                                    <div className="flex items-center gap-1">
                                        <Globe className="w-3 h-3 text-blue-600" />
                                        <span className="text-gray-700">Instagram</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-center gap-2 ml-4">
                        <div className="w-36 h-36 relative"> 
                            {/* 2. Substituído <img> por <Image> */}
                            <Image
                                src="/Logo.png"
                                alt="Logo Conexão Distribuidora"
                                layout="fill"
                                objectFit="contain"
                            />
                        </div>
                    </div>
                </header>


                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-1 space-y-4">
                        <section>
                            <h2 className="font-bold text-blue-800 flex items-center border-b border-gray-200 pb-1 mb-2">
                                <GraduationCap className="w-4 h-4 mr-1 text-blue-600" />
                                FORMAÇÃO
                            </h2>
                            <div className="text-sm">
                                <p className="font-medium">{candidato.escolaridadeCandidato || '—'}</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="font-bold text-blue-800 flex items-center border-b border-gray-200 pb-1 mb-2">
                                <Terminal className="w-4 h-4 mr-1 text-blue-600" />
                                CONHECIMENTOS
                            </h2>
                            <div className="text-sm space-y-2">
                                {candidato.wordCandidato && (
                                    <div>
                                        <p className="font-medium">Microsoft Office</p>
                                        <ul className="ml-4 space-y-1">
                                            {candidato.wordCandidato && (
                                                <li className="flex items-start">
                                                    <Check className="w-3 h-3 text-blue-600 mt-1 mr-1" />
                                                    <span className='text-gray-600'>Word: {candidato.wordCandidato}</span>
                                                </li>
                                            )}
                                            {candidato.excelCandidato && (
                                                <li className="flex items-start">
                                                    <Check className="w-3 h-3 text-blue-600 mt-1 mr-1" />
                                                    <span className='text-gray-600'>Excel: {candidato.excelCandidato}</span>
                                                </li>
                                            )}
                                            {candidato.powerpointCandidato && (
                                                <li className="flex items-start">
                                                    <Check className="w-3 h-3 text-blue-600 mt-1 mr-1" />
                                                    <span className='text-gray-600'>PowerPoint: {candidato.powerpointCandidato}</span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {candidato.conhecimentosinformaticaCandidato && (
                                    <div>
                                        <p className="font-medium">Informática</p>
                                        <p className="ml-4 break-words max-w-[230px]">{candidato.conhecimentosinformaticaCandidato}</p>
                                    </div>
                                )}

                                {candidato.conhecimentoinfcandidato && (
                                    <div>
                                        <p className="font-medium">Outros Conhecimentos</p>
                                        <p className="ml-4">{candidato.conhecimentoinfcandidato}</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {candidato.cidareacandidato && candidato.cidareacandidato.trim() !== '' && (
                            <section>
                                <h2 className="font-bold text-blue-800 flex items-center border-b border-gray-200 pb-1 mb-2">
                                    <Award className="w-4 h-4 mr-1 text-blue-600" />
                                    PCD
                                </h2>
                                <div className="text-sm">
                                    <p>CID: {candidato.cidareacandidato}</p>
                                </div>
                            </section>
                        )}

                        {candidato.vagainteresseCandidato && (
                            <section>
                                <h2 className="font-bold text-blue-800 flex items-center border-b border-gray-200 pb-1 mb-2">
                                    <Award className="w-4 h-4 mr-1 text-blue-600" />
                                    ÁREA DE INTERESSE
                                </h2>
                                <div className="text-sm">
                                    <p>{candidato.vagainteresseCandidato}</p>
                                </div>
                            </section>
                        )}

                        {candidato.conhecimentosCandidato && (
                            <section>
                                <h2 className="font-bold text-blue-800 flex items-center border-b border-gray-200 pb-1 mb-2">
                                    <Award className="w-4 h-4 mr-1 text-blue-600" />
                                    DIFERENCIAIS
                                </h2>
                                <div className="text-sm">
                                    <p>{candidato.conhecimentosCandidato}</p>
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="col-span-2">
                        <h2 className="font-bold text-blue-800 flex items-center border-b border-gray-200 pb-1 mb-4">
                            <Briefcase className="w-4 h-4 mr-1 text-blue-600" />
                            EXPERIÊNCIA PROFISSIONAL
                        </h2>

                        <div className="space-y-4 text-sm">
                            {candidato.empresaCandidato && (
                                <div className="border-l-2 border-blue-500 pl-3 pb-3">
                                    <div className="flex justify-between">
                                        <h3 className="font-bold text-blue-600">{candidato.empresaCandidato}</h3>
                                        <p className="text-gray-600">
                                            {formatarData(candidato.datainicioCandidato)} -
                                            {candidato.trabalha1Candidato === 'Sim' ? ' Atual' : ` ${formatarData(candidato.datafinalCandidato)}`}
                                        </p>
                                    </div>
                                    <p className="text-gray-600 italic">{candidato.local1Candidato || '—'}</p>
                                    <p className="mt-1">{candidato.atividadesdesenvolvidas1Candidato || '—'}</p>
                                </div>
                            )}

                            {candidato.empresa2Candidato && (
                                <div className="border-l-2 border-blue-400 pl-3 pb-3">
                                    <div className="flex justify-between">
                                        <h3 className="font-bold text-blue-600">{candidato.empresa2Candidato}</h3>
                                        <p className="text-gray-600">
                                            {formatarData(candidato.datainicio2Candidato)} -
                                            {candidato.trabalha2Candidato === 'Sim' ? ' Atual' : ` ${formatarData(candidato.datafinal2Candidato)}`}
                                        </p>
                                    </div>
                                    <p className="text-gray-600 italic">{candidato.local2Candidato || '—'}</p>
                                    <p className="mt-1">{candidato.atividadesdesenvolvidas2Candidato || '—'}</p>
                                </div>
                            )}

                            {candidato.empresa3Candidato && (
                                <div className="border-l-2 border-blue-300 pl-3 pb-3">
                                    <div className="flex justify-between">
                                        <h3 className="font-bold text-blue-600">{candidato.empresa3Candidato}</h3>
                                        <p className="text-gray-600">
                                            {formatarData(candidato.datainicio3Candidato)} -
                                            {candidato.trabalha3Candidato === 'Sim' ? ' Atual' : ` ${formatarData(candidato.datafinal3Candidato)}`}
                                        </p>
                                    </div>
                                    <p className="text-gray-600 italic">{candidato.local3Candidato || '—'}</p>
                                    <p className="mt-1">{candidato.atividadesdesenvolvidas3Candidato || '—'}</p>
                                </div>
                            )}

                            {!candidato.empresaCandidato && !candidato.empresa2Candidato && !candidato.empresa3Candidato && (
                                <p className="text-gray-500 italic">Sem experiência profissional registrada</p>
                            )}
                        </div>
                    </div>
                </div>

                <footer className="mt-8 pt-2 border-t border-gray-300 text-center text-xs text-gray-500">
                    Currículo gerado em {new Date().toLocaleDateString('pt-BR')}
                </footer>
            </div>

        </main>
    )
}
