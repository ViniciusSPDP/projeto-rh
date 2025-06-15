'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, User, Mail, Phone, MapPin, Briefcase, CheckCircle, Circle } from 'lucide-react'
import { Candidatos, Prisma } from '@prisma/client'
import toast from 'react-hot-toast'

// --- Tipos e Interfaces ---

interface FormEditarCandidatoProps {
    candidato: Candidatos;
}

// Tipo para o estado do formulário
type FormDataType = Omit<Partial<Prisma.CandidatosUpdateInput>, 'conhecimentosinformaticaCandidato'> & {
    conhecimentosinformaticaCandidato: string[];
};

// --- Funções Auxiliares ---

function formatDate(dateString?: string | Date | null): string {
    if (!dateString) return ''
    const date = new Date(dateString);
    // Ajusta para o fuso horário local para evitar problemas de um dia a menos
    const offset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + offset);
    return adjustedDate.toISOString().split('T')[0];
}

// --- Componente Principal ---

export default function FormEditarCandidato({ candidato }: FormEditarCandidatoProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('pessoal')

    // Estado inicial do formulário com tipagem forte
    const [formData, setFormData] = useState<FormDataType>({
        nomeCandidato: candidato.nomeCandidato || '',
        cpfCandidato: candidato.cpfCandidato || '',
        rgCandidato: candidato.rgCandidato || '',
        sexoCandidato: candidato.sexoCandidato || '',
        outrosexoCandidato: candidato.outrosexoCandidato || '',
        estadocivilCandidato: candidato.estadocivilCandidato || '',
        datanascimentoCandidato: formatDate(candidato.datanascimentoCandidato),
        emailCandidato: candidato.emailCandidato || '',
        telefoneCandidato: candidato.telefoneCandidato || '',
        telefone2Candidato: candidato.telefone2Candidato || '',
        cnhCandidato: candidato.cnhCandidato || '',
        categoriacnhCandidato: candidato.categoriacnhCandidato || '',
        pcdCandidato: candidato.pcdCandidato || '',
        cidareacandidato: candidato.cidareacandidato || '',
        linkedinCandidato: candidato.linkedinCandidato || '',
        facebookCandidato: candidato.facebookCandidato || '',
        instagramCandidato: candidato.instagramCandidato || '',
        cepCandidato: candidato.cepCandidato || '',
        ruaCandidato: candidato.ruaCandidato || '',
        numeroCandidato: candidato.numeroCandidato || '',
        bairroCandidato: candidato.bairroCandidato || '',
        cidadeCandidato: candidato.cidadeCandidato || '',
        estadoCandidato: candidato.estadoCandidato || '',
        vagainteresseCandidato: candidato.vagainteresseCandidato || '',
        escolaridadeCandidato: candidato.escolaridadeCandidato || '',
        conhecimentosCandidato: candidato.conhecimentosCandidato || '',
        wordCandidato: candidato.wordCandidato || '',
        excelCandidato: candidato.excelCandidato || '',
        powerpointCandidato: candidato.powerpointCandidato || '',
        conhecimentosinformaticaCandidato: typeof candidato.conhecimentosinformaticaCandidato === 'string'
            ? candidato.conhecimentosinformaticaCandidato.split(',').map(v => v.trim()).filter(Boolean)
            : [],
        conhecimentoinfcandidato: candidato.conhecimentoinfcandidato || '',
        possuiexperienciaCandidato: candidato.possuiexperienciaCandidato || '',
        empresaCandidato: candidato.empresaCandidato || '',
        local1Candidato: candidato.local1Candidato || '',
        atividadesdesenvolvidas1Candidato: candidato.atividadesdesenvolvidas1Candidato || '',
        datainicioCandidato: formatDate(candidato.datainicioCandidato),
        trabalha1Candidato: candidato.trabalha1Candidato || '',
        datafinalCandidato: formatDate(candidato.datafinalCandidato),
        empresa2Candidato: candidato.empresa2Candidato || '',
        local2Candidato: candidato.local2Candidato || '',
        atividadesdesenvolvidas2Candidato: candidato.atividadesdesenvolvidas2Candidato || '',
        datainicio2Candidato: formatDate(candidato.datainicio2Candidato),
        trabalha2Candidato: candidato.trabalha2Candidato || '',
        datafinal2Candidato: formatDate(candidato.datafinal2Candidato),
        empresa3Candidato: candidato.empresa3Candidato || '',
        local3Candidato: candidato.local3Candidato || '',
        atividadesdesenvolvidas3Candidato: candidato.atividadesdesenvolvidas3Candidato || '',
        datainicio3Candidato: formatDate(candidato.datainicio3Candidato),
        trabalha3Candidato: candidato.trabalha3Candidato || '',
        datafinal3Candidato: formatDate(candidato.datafinal3Candidato),
        fotoCandidato: candidato.fotoCandidato || '',
        parentescoCandidato: candidato.parentescoCandidato || '',
        graudeparentescoenomeCandidato: candidato.graudeparentescoenomeCandidato || '',
        situacaoCandidato: candidato.situacaoCandidato || '',
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox' && name === 'conhecimentosinformaticaCandidato') {
            const { checked, value: checkboxValue } = e.target as HTMLInputElement;
            const currentValues = formData.conhecimentosinformaticaCandidato || [];
            const newValues = checked
                ? [...currentValues, checkboxValue]
                : currentValues.filter((v) => v !== checkboxValue);

            setFormData(prev => ({
                ...prev,
                conhecimentosinformaticaCandidato: newValues,
                ...(checkboxValue === 'Outros' && !checked && { conhecimentoinfcandidato: '' }),
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'pcdCandidato' && value === 'Não' && { cidareacandidato: '' }),
        }));
    };

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
            const body = {
                ...formData,
                conhecimentosinformaticaCandidato: formData.conhecimentosinformaticaCandidato.join(', '),
            };

            const res = await fetch(`/api/candidatos/${candidato.idCandidato}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: 'Falha ao atualizar candidato.' }));
                throw new Error(errorData.error);
            }

            toast.success('Candidato atualizado com sucesso!');
            router.push(`/candidatos/${candidato.idCandidato}`);
            router.refresh();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const buscarCep = async () => {
        const cep = String(formData.cepCandidato || '').replace(/\D/g, '');
        if (cep.length !== 8) return;
        setLoading(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                setFormData(prev => ({
                    ...prev,
                    ruaCandidato: data.logradouro,
                    bairroCandidato: data.bairro,
                    cidadeCandidato: data.localidade,
                    estadoCandidato: data.uf,
                }));
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            toast.error('Não foi possível buscar o CEP.');
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'pessoal', label: 'Dados Pessoais', icon: <User size={18} /> },
        { id: 'endereco', label: 'Endereço', icon: <MapPin size={18} /> },
        { id: 'formacao', label: 'Formação', icon: <CheckCircle size={18} /> },
        { id: 'experiencia', label: 'Experiência', icon: <Briefcase size={18} /> },
        { id: 'outros', label: 'Outros Dados', icon: <Circle size={18} /> },
    ];
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-blue-800 mb-8 flex items-center">
                <User className="mr-2" /> Editar Candidato
            </h1>

            <div className="flex overflow-x-auto mb-8 border-b border-blue-100">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`flex items-center px-4 py-3 font-medium transition-colors duration-200 whitespace-nowrap ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="mr-2">{tab.icon}</span>{tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* O seu JSX das abas pode ser colado aqui. Lembre-se de ajustar os 'value' e 'onChange' como nos exemplos anteriores para garantir a tipagem correta. */}
                {/* Tab Dados Pessoais */}
                {activeTab === 'pessoal' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                    Nome Completo <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                        <User size={16} />
                                    </span>
                                    <input
                                        type="text"
                                        name="nomeCandidato"
                                        value={String(formData.nomeCandidato || '')}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                    Data de Nascimento
                                </label>
                                <input
                                    type="date"
                                    name="datanascimentoCandidato"
                                    value={formatDate(formData.datanascimentoCandidato as string | Date)}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                    CPF
                                </label>
                                <input
                                    type="text"
                                    name="cpfCandidato"
                                    value={String(formData.cpfCandidato || '')}
                                    onChange={handleChange}
                                    placeholder="000.000.000-00"
                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                    RG
                                </label>
                                <input
                                    type="text"
                                    name="rgCandidato"
                                    value={String(formData.rgCandidato || '')}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                    Sexo
                                </label>
                                <select
                                    name="sexoCandidato"
                                    value={String(formData.sexoCandidato || '')}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Selecione</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Feminino">Feminino</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>

                            {formData.sexoCandidato === 'Outro' && (
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        Especifique
                                    </label>
                                    <input
                                        type="text"
                                        name="outrosexoCandidato"
                                        value={String(formData.outrosexoCandidato || '')}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                    Estado Civil
                                </label>
                                <select
                                    name="estadocivilCandidato"
                                    value={String(formData.estadocivilCandidato || '')}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Selecione</option>
                                    <option value="Solteiro(a)">Solteiro(a)</option>
                                    <option value="Casado(a)">Casado(a)</option>
                                    <option value="Divorciado(a)">Divorciado(a)</option>
                                    <option value="Viúvo(a)">Viúvo(a)</option>
                                    <option value="União Estável">União Estável</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                    Pessoa com Deficiência
                                </label>
                                <select
                                    name="pcdCandidato"
                                    value={String(formData.pcdCandidato || '')}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Selecione</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Não">Não</option>
                                </select>
                            </div>
                            {formData.pcdCandidato === 'Sim' && (
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        CID Candidato
                                    </label>
                                    <input
                                        type="text"
                                        name="cidareacandidato"
                                        value={String(formData.cidareacandidato || '')}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            )}

                        </div>

                        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                            <h3 className="text-lg font-medium text-blue-800 mb-3">Contato</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                            <Mail size={16} />
                                        </span>
                                        <input
                                            type="email"
                                            name="emailCandidato"
                                            value={String(formData.emailCandidato || '')}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        Telefone Principal <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                            <Phone size={16} />
                                        </span>
                                        <input
                                            type="tel"
                                            name="telefoneCandidato"
                                            value={String(formData.telefoneCandidato || '')}
                                            onChange={handleChange}
                                            required
                                            placeholder="(00) 00000-0000"
                                            className="w-full pl-10 pr-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        Telefone Secundário
                                    </label>
                                    <input
                                        type="tel"
                                        name="telefone2Candidato"
                                        value={String(formData.telefone2Candidato || '')}
                                        onChange={handleChange}
                                        placeholder="(00) 00000-0000"
                                        className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                            <h3 className="text-lg font-medium text-blue-800 mb-3">Documentos</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        CNH
                                    </label>
                                    <select
                                        name="cnhCandidato"
                                        value={String(formData.cnhCandidato || '')}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Selecione</option>
                                        <option value="Sim">Sim</option>
                                        <option value="Não">Não</option>
                                    </select>
                                </div>

                                {formData.cnhCandidato === 'Sim' && (
                                    <div>
                                        <label className="block text-sm font-medium text-blue-700 mb-1">
                                            Categoria CNH
                                        </label>
                                        <select
                                            name="categoriacnhCandidato"
                                            value={String(formData.categoriacnhCandidato || '')}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Selecione</option>
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="AB">AB</option>
                                            <option value="C">C</option>
                                            <option value="D">D</option>
                                            <option value="E">E</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                            <h3 className="text-lg font-medium text-blue-800 mb-3">Redes Sociais</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        LinkedIn
                                    </label>
                                    <input
                                        type="url"
                                        name="linkedinCandidato"
                                        value={String(formData.linkedinCandidato || '')}
                                        onChange={handleChange}
                                        placeholder="https://linkedin.com/in/usuario"
                                        className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        Facebook
                                    </label>
                                    <input
                                        type="url"
                                        name="facebookCandidato"
                                        value={String(formData.facebookCandidato || '')}
                                        onChange={handleChange}
                                        placeholder="https://facebook.com/usuario"
                                        className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        Instagram
                                    </label>
                                    <input
                                        type="url"
                                        name="instagramCandidato"
                                        value={String(formData.instagramCandidato || '')}
                                        onChange={handleChange}
                                        placeholder="https://instagram.com/usuario"
                                        className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Endereço */}
                {activeTab === 'endereco' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                    CEP
                                </label>
                                <input
                                    type="text"
                                    name="cepCandidato"
                                    value={String(formData.cepCandidato || '')}
                                    onChange={handleChange}
                                    onBlur={buscarCep}
                                    placeholder="00000-000"
                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                    Rua
                                </label>
                                <input
                                    type="text"
                                    name="ruaCandidato"
                                    value={String(formData.ruaCandidato || '')}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                    Número
                                </label>
                                <input
                                    type="text"
                                    name="numeroCandidato"
                                    value={String(formData.numeroCandidato || '')}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                    Bairro
                                </label>
                                <input
                                    type="text"
                                    name="bairroCandidato"
                                    value={String(formData.bairroCandidato || '')}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                    Cidade
                                </label>
                                <input
                                    type="text"
                                    name="cidadeCandidato"
                                    value={String(formData.cidadeCandidato || '')}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                    Estado
                                </label>
                                <input
                                    type="text"
                                    name="estadoCandidato"
                                    value={String(formData.estadoCandidato || '')}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Formação */}
                {activeTab === 'formacao' && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                            <h3 className="text-lg font-medium text-blue-800 mb-3">Formação e Habilidades</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        Escolaridade
                                    </label>
                                    <select
                                        name="escolaridadeCandidato"
                                        value={String(formData.escolaridadeCandidato || '')}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Selecione</option>
                                        <option value="Ensino Fundamental">Ensino Fundamental</option>
                                        <option value="Ensino Médio">Ensino Médio</option>
                                        <option value="Ensino Técnico">Ensino Técnico</option>
                                        <option value="Ensino Superior">Ensino Superior</option>
                                        <option value="Pós-Graduação">Pós-Graduação</option>
                                        <option value="Mestrado">Mestrado</option>
                                        <option value="Doutorado">Doutorado</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        Vaga de Interesse
                                    </label>
                                    <select
                                        name="vagainteresseCandidato"
                                        value={String(formData.vagainteresseCandidato || '')}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Selecione uma opção</option>
                                        <option value="Administrativo">Administrativo</option>
                                        <option value="Reposição">Reposição</option>
                                        <option value="Expedição">Expedição</option>
                                        <option value="Recebimento">Recebimento</option>
                                        <option value="Entrega">Entrega</option>
                                        <option value="Financeiro">Financeiro</option>
                                        <option value="Compras">Compras</option>
                                        <option value="Fiscal">Fiscal</option>
                                        <option value="Vendas">Vendas</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Conferência">Conferência</option>
                                        <option value="RH">RH</option>
                                        <option value="TI">TI</option>
                                    </select>
                                </div>


                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        Diferencial
                                    </label>
                                    <textarea
                                        name="conhecimentosCandidato"
                                        value={String(formData.conhecimentosCandidato || '')}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border text-gray-600 border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                            <h3 className="text-lg font-medium text-blue-800 mb-3">Conhecimentos</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        Microsoft Word
                                    </label>
                                    <select
                                        name="wordCandidato"
                                        value={String(formData.wordCandidato || '')}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Selecione</option>
                                        <option value="Básico">Básico</option>
                                        <option value="Intermediário">Intermediário</option>
                                        <option value="Avançado">Avançado</option>
                                        <option value="Nenhum">Nenhum</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        Microsoft Excel
                                    </label>
                                    <select
                                        name="excelCandidato"
                                        value={String(formData.excelCandidato || '')}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Selecione</option>
                                        <option value="Básico">Básico</option>
                                        <option value="Intermediário">Intermediário</option>
                                        <option value="Avançado">Avançado</option>
                                        <option value="Nenhum">Nenhum</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        Microsoft PowerPoint
                                    </label>
                                    <select
                                        name="powerpointCandidato"
                                        value={String(formData.powerpointCandidato || '')}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Selecione</option>
                                        <option value="Básico">Básico</option>
                                        <option value="Intermediário">Intermediário</option>
                                        <option value="Avançado">Avançado</option>
                                        <option value="Nenhum">Nenhum</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        Outros Conhecimentos de Informática
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            'AutoCAD',
                                            'Corel Draw',
                                            'Photoshop',
                                            'Programação',
                                            'YouTube e edição de vídeos',
                                            'Outros',
                                        ].map((opcao) => (
                                            <label key={opcao} className="flex items-center gap-2 text-sm text-blue-900">
                                                <input
                                                    type="checkbox"
                                                    name="conhecimentosinformaticaCandidato"
                                                    value={opcao}
                                                    checked={formData.conhecimentosinformaticaCandidato?.includes(opcao)}

                                                    onChange={(e) => {
                                                        const { value, checked } = e.target
                                                        const atual: string[] = formData.conhecimentosinformaticaCandidato || []

                                                        const atualizado = checked
                                                            ? [...atual, value]
                                                            : atual.filter((v: string) => v !== value)

                                                        setFormData({
                                                            ...formData,
                                                            conhecimentosinformaticaCandidato: atualizado,
                                                            ...(value === 'Outros' && !checked ? { conhecimentoinfcandidato: '' } : {}), // 👈 limpa o campo se "Outros" for desmarcado
                                                        })
                                                    }}
                                                />
                                                {opcao}
                                            </label>
                                        ))}
                                    </div>
                                </div>



                            </div>
                            {/* Condicional: mostrar textarea se "Outros" estiver marcado */}
                            {formData.conhecimentosinformaticaCandidato?.includes('Outros') && (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        Especifique os outros conhecimentos
                                    </label>
                                    <textarea
                                        name="conhecimentoinfcandidato"
                                        value={String(formData.conhecimentoinfcandidato || '')}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border text-gray-600 border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tab Experiência */}

                {activeTab === 'experiencia' && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                            <h3 className="text-lg font-medium text-blue-800 mb-3">Experiência Profissional</h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                    Possui experiência profissional?
                                </label>
                                <select
                                    name="possuiexperienciaCandidato"
                                    value={String(formData.possuiexperienciaCandidato || '')}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Selecione</option>
                                    <option value="Sim">Sim</option>
                                    <option value="Não">Não</option>
                                </select>
                            </div>

                            {formData.possuiexperienciaCandidato === 'Sim' && (
                                <>
                                    {/* Experiência 1 */}
                                    <div className="mb-6 p-4 bg-white rounded-md border border-blue-100">
                                        <h4 className="text-md font-medium text-blue-800 mb-3">Experiência 1</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                                    Empresa
                                                </label>
                                                <input
                                                    type="text"
                                                    name="empresaCandidato"
                                                    value={String(formData.empresaCandidato || '')}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                                    Local
                                                </label>
                                                <input
                                                    type="text"
                                                    name="local1Candidato"
                                                    value={String(formData.local1Candidato || '')}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                                    Data de Início
                                                </label>
                                                <input
                                                    type="date"
                                                    name="datainicioCandidato"
                                                    value={formatDate(formData.datainicioCandidato as string | Date)}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                                    Data de Término
                                                </label>
                                                <input
                                                    type="date"
                                                    name="datafinalCandidato"
                                                    value={formatDate(formData.datafinalCandidato as string | Date)}
                                                    onChange={handleChange}
                                                    disabled={formData.trabalha1Candidato === 'Sim'}
                                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                                    Trabalha atualmente aqui?
                                                </label>
                                                <select
                                                    name="trabalha1Candidato"
                                                    value={String(formData.trabalha1Candidato || '')}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="">Selecione</option>
                                                    <option value="Sim">Sim</option>
                                                    <option value="Não">Não</option>
                                                </select>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                                    Atividades Desenvolvidas
                                                </label>
                                                <textarea
                                                    name="atividadesdesenvolvidas1Candidato"
                                                    value={String(formData.atividadesdesenvolvidas1Candidato || '')}
                                                    onChange={handleChange}
                                                    rows={3}
                                                    className="text-gray-500 w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Experiência 2 */}
                                    <div className="mb-6 p-4 bg-white rounded-md border border-blue-100">
                                        <h4 className="text-md font-medium text-blue-800 mb-3">Experiência 2</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                                    Empresa
                                                </label>
                                                <input
                                                    type="text"
                                                    name="empresa2Candidato"
                                                    value={String(formData.empresa2Candidato || '')}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                                    Local
                                                </label>
                                                <input
                                                    type="text"
                                                    name="local2Candidato"
                                                    value={String(formData.local2Candidato || '')}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                                    Data de Início
                                                </label>
                                                <input
                                                    type="date"
                                                    name="datainicio2Candidato"
                                                    value={formatDate(formData.datainicio2Candidato as string | Date)}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                                    Data de Término
                                                </label>
                                                <input
                                                    type="date"
                                                    name="datafinal2Candidato"
                                                    value={formatDate(formData.datafinal2Candidato as string | Date)}
                                                    onChange={handleChange}
                                                    disabled={formData.trabalha2Candidato === 'Sim'}
                                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                                    Trabalha atualmente aqui?
                                                </label>
                                                <select
                                                    name="trabalha2Candidato"
                                                    value={String(formData.trabalha2Candidato || '')}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="">Selecione</option>
                                                    <option value="Sim">Sim</option>
                                                    <option value="Não">Não</option>
                                                </select>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                                    Atividades Desenvolvidas
                                                </label>
                                                <textarea
                                                    name="atividadesdesenvolvidas2Candidato"
                                                    value={String(formData.atividadesdesenvolvidas2Candidato || '')}
                                                    onChange={handleChange}
                                                    rows={3}
                                                    className="w-full text-gray-500 px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Experiência 3 */}
                                    <div className="p-4 bg-white rounded-md border border-blue-100">
                                        <h4 className="text-md font-medium text-blue-800 mb-3">Experiência 3</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                                    Empresa
                                                </label>
                                                <input
                                                    type="text"
                                                    name="empresa3Candidato"
                                                    value={String(formData.empresa3Candidato || '')}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                                    Local
                                                </label>
                                                <input
                                                    type="text"
                                                    name="local3Candidato"
                                                    value={String(formData.local3Candidato || '')}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                                    Data de Início
                                                </label>
                                                <input
                                                    type="date"
                                                    name="datainicio3Candidato"
                                                    value={formatDate(formData.datainicio3Candidato as string | Date)}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                                    Data de Término
                                                </label>
                                                <input
                                                    type="date"
                                                    name="datafinal3Candidato"
                                                    value={formatDate(formData.datafinal3Candidato as string | Date)}
                                                    onChange={handleChange}
                                                    disabled={formData.trabalha3Candidato === 'Sim'}
                                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                                    Trabalha atualmente aqui?
                                                </label>
                                                <select
                                                    name="trabalha3Candidato"
                                                    value={String(formData.trabalha3Candidato || '')}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="">Selecione</option>
                                                    <option value="Sim">Sim</option>
                                                    <option value="Não">Não</option>
                                                </select>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-blue-700 mb-1">
                                                    Atividades Desenvolvidas
                                                </label>
                                                <textarea
                                                    name="atividadesdesenvolvidas3Candidato"
                                                    value={String(formData.atividadesdesenvolvidas3Candidato || '')}
                                                    onChange={handleChange}
                                                    rows={3}
                                                    className="w-full text-gray-500 px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Tab Outros Dados */}
                {activeTab === 'outros' && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                            <h3 className="text-lg font-medium text-blue-800 mb-3">Informações Adicionais</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        Foto (URL)
                                    </label>
                                    <input
                                        type="url"
                                        name="fotoCandidato"
                                        value={String(formData.fotoCandidato || '')}
                                        onChange={handleChange}
                                        placeholder="https://exemplo.com/foto.jpg"
                                        className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        Parentesco na Empresa
                                    </label>
                                    <select
                                        name="parentescoCandidato"
                                        value={String(formData.parentescoCandidato || '')}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Selecione</option>
                                        <option value="Sim">Sim</option>
                                        <option value="Não">Não</option>
                                    </select>
                                </div>

                                {formData.parentescoCandidato === 'Sim' && (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-blue-700 mb-1">
                                            Grau de Parentesco e Nome
                                        </label>
                                        <input
                                            type="text"
                                            name="graudeparentescoenomeCandidato"
                                            value={String(formData.graudeparentescoenomeCandidato || '')}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-blue-700 mb-1">
                                        Situação do Candidato
                                    </label>
                                    <select
                                        name="situacaoCandidato"
                                        value={String(formData.situacaoCandidato || '')}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Selecione</option>
                                        <option value="Aprovado">Aprovado</option>
                                        <option value="Reprovado">Reprovado</option>
                                        <option value="Em análise">Em análise</option>
                                        <option value="Contratado">Contratado</option>
                                        <option value="Em processo">Em processo</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-4 pt-6 border-t border-blue-100">
                    <button type="button" onClick={() => router.push('/candidatos')} className="px-4 py-2 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 transition-colors">Cancelar</button>
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                        {loading ? <><Loader2 className="animate-spin mr-2" size={18} />Salvando...</> : <><Save className="mr-2" size={18} />Salvar Alterações</>}
                    </button>
                </div>
            </form>
        </div>
    )
}
