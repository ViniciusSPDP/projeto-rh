'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
    Loader2, User, MapPin, Briefcase, CheckCircle, GraduationCap, UploadCloud, X, Contact, ArrowLeft, ArrowRight, FileText, PlusCircle
} from 'lucide-react'
import { IMaskInput } from 'react-imask'
import toast from 'react-hot-toast'
import { Prisma } from '@prisma/client'

// --- Tipos e Constantes ---

type TabId = 'pessoal' | 'documentos' | 'endereco' | 'formacao' | 'experiencia' | 'outros'

// Tipo robusto para os dados do formulário, baseado no schema do Prisma
// AQUI ESTÁ A CORREÇÃO: Usamos Omit para remover a chave conflitante do tipo do Prisma
// antes de adicionar a nossa própria versão.
type FormDataType = Omit<Partial<Prisma.CandidatosCreateInput>, 'conhecimentosinformaticaCandidato'> & {
    conhecimentosinformaticaCandidato: string[]; // Agora, este é a única definição para este campo
    possuiexperienciaCandidato: string;
    trabalha1Candidato: string;
    trabalha2Candidato: string;
    trabalha3Candidato: string;
};


// Interface para as props do componente ExperienciaFields
interface ExperienciaFieldsProps {
    index: number;
    formData: FormDataType;
    handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { name: string; value: string }) => void;
}

const TABS_CONFIG = [
    { id: 'pessoal', label: 'Dados Pessoais', icon: Contact },
    { id: 'documentos', label: 'Documentos e Redes', icon: FileText },
    { id: 'endereco', label: 'Endereço', icon: MapPin },
    { id: 'formacao', label: 'Formação', icon: GraduationCap },
    { id: 'experiencia', label: 'Experiência', icon: Briefcase },
    { id: 'outros', label: 'Finalização', icon: CheckCircle },
] as const;

const inputClasses = "block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

// --- Componentes Utilitários ---

function FormField({ id, label, children }: { id: string, label: string, children: React.ReactNode }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
            <div className="mt-2">{children}</div>
        </div>
    );
}

function ExperienciaFields({ index, formData, handleChange }: ExperienciaFieldsProps) {
    const prefix = index === 1 ? '' : String(index);
    // Usamos 'as keyof FormDataType' para garantir ao TypeScript que essas chaves dinâmicas são válidas
    const fieldNames = {
        empresa: `empresa${prefix}Candidato` as keyof FormDataType,
        local: `local${index}Candidato` as keyof FormDataType,
        atividades: `atividadesdesenvolvidas${index}Candidato` as keyof FormDataType,
        inicio: `datainicio${prefix}Candidato` as keyof FormDataType,
        fim: `datafinal${prefix}Candidato` as keyof FormDataType,
        trabalha: `trabalha${index}Candidato` as keyof FormDataType,
    };

    return (
        <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="mb-4 font-semibold text-gray-800">Experiência {index}</h3>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3"><FormField id={fieldNames.empresa} label="Empresa"><input type="text" name={fieldNames.empresa} id={fieldNames.empresa} value={String(formData[fieldNames.empresa] || '')} onChange={handleChange} className={inputClasses} /></FormField></div>
                <div className="sm:col-span-3"><FormField id={fieldNames.local} label="Local"><input type="text" name={fieldNames.local} id={fieldNames.local} value={String(formData[fieldNames.local] || '')} onChange={handleChange} className={inputClasses} /></FormField></div>
                <div className="sm:col-span-3"><FormField id={fieldNames.inicio} label="Data de Início"><input type="date" name={fieldNames.inicio} id={fieldNames.inicio} value={String(formData[fieldNames.inicio] || '').split('T')[0]} onChange={handleChange} className={inputClasses} /></FormField></div>
                <div className="sm:col-span-3"><FormField id={fieldNames.fim} label="Data de Término"><input type="date" name={fieldNames.fim} id={fieldNames.fim} value={String(formData[fieldNames.fim] || '').split('T')[0]} disabled={formData[fieldNames.trabalha] === 'Sim'} onChange={handleChange} className={`${inputClasses} disabled:bg-gray-100`} /></FormField></div>
                <div className="sm:col-span-full"><label className="flex items-center gap-2 text-sm font-medium text-gray-800"><input type="checkbox" name={fieldNames.trabalha} checked={formData[fieldNames.trabalha] === 'Sim'} onChange={e => handleChange({ name: fieldNames.trabalha, value: e.target.checked ? 'Sim' : 'Não' })} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />Trabalho atualmente aqui</label></div>
                <div className="col-span-full"><FormField id={fieldNames.atividades} label="Atividades Desenvolvidas"><textarea name={fieldNames.atividades} id={fieldNames.atividades} value={String(formData[fieldNames.atividades] || '')} onChange={handleChange} rows={3} className={inputClasses} /></FormField></div>
            </div>
        </div>
    );
}

// --- Componente Principal ---
export default function FormCandidato({ vagaId }: { vagaId?: number }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<TabId>('pessoal');
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [visibleExperiences, setVisibleExperiences] = useState(0);

    const [formData, setFormData] = useState<FormDataType>({
        nomeCandidato: '', cpfCandidato: '', rgCandidato: '', sexoCandidato: '', outrosexoCandidato: '',
        estadocivilCandidato: '', datanascimentoCandidato: '', emailCandidato: '', telefoneCandidato: '',
        telefone2Candidato: '', cnhCandidato: '', categoriacnhCandidato: '', pcdCandidato: '', cidareacandidato: '',
        linkedinCandidato: '', facebookCandidato: '', instagramCandidato: '', fotoCandidato: '', cepCandidato: '',
        ruaCandidato: '', numeroCandidato: '', bairroCandidato: '', cidadeCandidato: '', estadoCandidato: '',
        vagainteresseCandidato: '', escolaridadeCandidato: '', conhecimentosCandidato: '', wordCandidato: 'Desconheço',
        excelCandidato: 'Desconheço', powerpointCandidato: 'Desconheço', conhecimentosinformaticaCandidato: [],
        conhecimentoinfcandidato: '', possuiexperienciaCandidato: '', empresaCandidato: '', local1Candidato: '',
        atividadesdesenvolvidas1Candidato: '', datainicioCandidato: '', trabalha1Candidato: 'Não', datafinalCandidato: '',
        empresa2Candidato: '', local2Candidato: '', atividadesdesenvolvidas2Candidato: '', datainicio2Candidato: '',
        trabalha2Candidato: 'Não', datafinal2Candidato: '', empresa3Candidato: '', local3Candidato: '',
        atividadesdesenvolvidas3Candidato: '', datainicio3Candidato: '', trabalha3Candidato: 'Não', datafinal3Candidato: '',
        parentescoCandidato: 'Não', graudeparentescoenomeCandidato: '',
    });

    const handleTabNavigation = (direction: 'next' | 'prev') => {
        const currentIndex = TABS_CONFIG.findIndex(t => t.id === activeTab);
        const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (newIndex >= 0 && newIndex < TABS_CONFIG.length) setActiveTab(TABS_CONFIG[newIndex].id);
        window.scrollTo(0, 0);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | { name: string; value: string }) => {
        const { name, value } = 'target' in e ? e.target : e;

        // Lógica para o checkbox de múltiplos valores
        if ('target' in e && e.target.type === 'checkbox' && name === 'conhecimentosinformaticaCandidato') {
            // AQUI ESTÁ A CORREÇÃO:
            const { checked, value: checkboxValue } = e.target as HTMLInputElement;

            const currentValues = formData.conhecimentosinformaticaCandidato;
            const newValues = checked ? [...currentValues, checkboxValue] : currentValues.filter((v) => v !== checkboxValue);
            setFormData(prev => ({
                ...prev,
                conhecimentosinformaticaCandidato: newValues,
                ...(checkboxValue === 'Outros' && !checked ? { conhecimentoinfcandidato: '' } : {})
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Lógica para limpar campos dependentes
            ...(name === 'parentescoCandidato' && value === 'Não' && { graudeparentescoenomeCandidato: '' }),
            ...(name === 'pcdCandidato' && value === 'Não' && { cidareacandidato: '' }),
            ...(name === 'sexoCandidato' && value !== 'Outro' && { outrosexoCandidato: '' }),
            ...(name === 'possuiexperienciaCandidato' && value === 'Não' && {
                empresaCandidato: '', local1Candidato: '', atividadesdesenvolvidas1Candidato: '', datainicioCandidato: '', trabalha1Candidato: 'Não', datafinalCandidato: '',
                empresa2Candidato: '', local2Candidato: '', atividadesdesenvolvidas2Candidato: '', datainicio2Candidato: '', trabalha2Candidato: 'Não', datafinal2Candidato: '',
                // CORRIGIDO AQUI:
                empresa3Candidato: '', local3Candidato: '', atividadesdesenvolvidas3Candidato: '', datainicio3Candidato: '', trabalha3Candidato: 'Não', datafinal3Candidato: ''
            }),
        }));

        if (name === 'possuiexperienciaCandidato') {
            setVisibleExperiences(value === 'Sim' ? 1 : 0);
        }
    };

    const handleAddExperience = () => { if (visibleExperiences < 3) setVisibleExperiences(p => p + 1); };
    const removePhoto = () => { setPhotoPreview(null); setFormData(p => ({ ...p, fotoCandidato: '' })); };
    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setPhotoPreview(base64String);
            setFormData(prev => ({ ...prev, fotoCandidato: base64String }));
        };
        reader.readAsDataURL(file);
    };

    const buscarCep = async () => {
        const cep = (formData.cepCandidato || '').replace(/\D/g, '');
        if (cep.length !== 8) return;
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                setFormData(prev => ({ ...prev, ruaCandidato: data.logradouro, bairroCandidato: data.bairro, cidadeCandidato: data.localidade, estadoCandidato: data.uf }));
            }
        } catch (error) { console.error('Erro ao buscar CEP:', error); }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const bodyParaApi = {
                ...formData,
                conhecimentosinformaticaCandidato: formData.conhecimentosinformaticaCandidato.join(', '),
                vagaId,
                situacaoCandidato: vagaId ? 'Em processo' : 'Em análise',
            };

            const res = await fetch('/api/candidatos/publico', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyParaApi),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ error: 'Falha ao processar resposta do servidor.' }));
                throw new Error(errorData.error || 'Erro ao realizar inscrição.');
            }

            toast.success('Inscrição realizada com sucesso!');
            router.push(`/dashboard`);
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-5xl rounded-lg bg-white p-6 shadow-xl sm:p-8 min-h-screen">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">Formulário de Candidatura</h1>
                <p className="mt-2 text-gray-600">Preencha os campos abaixo para se candidatar à vaga.</p>
            </div>
            <div className="mb-8 flex items-start justify-center">
                {TABS_CONFIG.map((tab, index) => (
                    <div key={tab.id} className="flex flex-1 items-center">
                        <div className="flex flex-col items-center">
                            <button onClick={() => setActiveTab(tab.id)} className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all sm:h-12 sm:w-12 ${activeTab === tab.id ? 'border-indigo-600 bg-indigo-600 text-white' : TABS_CONFIG.findIndex(t => t.id === activeTab) > index ? 'border-indigo-600 bg-white text-indigo-600' : 'border-gray-300 bg-white text-gray-400 hover:border-gray-400'}`}>
                                {TABS_CONFIG.findIndex(t => t.id === activeTab) > index ? <CheckCircle size={24} /> : <tab.icon size={20} />}
                            </button>
                            <p className={`mt-2 hidden text-center text-xs font-medium sm:block sm:text-sm ${activeTab === tab.id || TABS_CONFIG.findIndex(t => t.id === activeTab) > index ? 'text-indigo-600' : 'text-gray-500'}`}>{tab.label}</p>
                        </div>
                        {index < TABS_CONFIG.length - 1 && <div className={`mt-5 h-0.5 flex-1 sm:mt-6 ${TABS_CONFIG.findIndex(t => t.id === activeTab) > index ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-12">
                {activeTab === 'pessoal' && (
                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 border-b pb-4 mb-6">Dados Pessoais e Contato</h2>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-6">
                            <div className="col-span-full">
                                <label className="block text-sm font-medium leading-6 text-gray-900">Foto de Perfil</label>
                                <div className="mt-2 flex items-center gap-x-3">
                                    {photoPreview ? (
                                        <div className="relative">
                                            <div className="relative h-24 w-24 rounded-full overflow-hidden">
                                                <Image src={photoPreview} alt="Prévia" layout="fill" objectFit="cover" />
                                            </div>
                                            <button type="button" onClick={removePhoto} className="absolute -right-1 -top-1 rounded-full bg-white p-0.5 text-gray-500 shadow-sm hover:bg-gray-100"><X size={16} /></button>
                                        </div>
                                    ) : (
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-gray-400"><User size={48} /></div>
                                    )}
                                    <label htmlFor="photo-upload" className="cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                        <UploadCloud className="mr-2 inline-block" size={16} />
                                        <span>{photoPreview ? 'Trocar foto' : 'Enviar foto'}</span>
                                        <input id="photo-upload" name="fotoCandidato" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
                                    </label>
                                </div>
                            </div>
                            <div className="sm:col-span-full"><FormField id="nomeCandidato" label="Nome Completo"><input type="text" name="nomeCandidato" id="nomeCandidato" value={formData.nomeCandidato || ''} onChange={handleChange} className={inputClasses} /></FormField></div>
                            <div className="sm:col-span-3"><FormField id="emailCandidato" label="Email"><input id="emailCandidato" name="emailCandidato" type="email" value={formData.emailCandidato || ''} onChange={handleChange} className={inputClasses} /></FormField></div>
                            <div className="sm:col-span-3"><FormField id="datanascimentoCandidato" label="Data de Nascimento"><input type="date" name="datanascimentoCandidato" id="datanascimentoCandidato" value={String(formData.datanascimentoCandidato || '').split('T')[0]} onChange={handleChange} className={inputClasses} /></FormField></div>
                            <div className="sm:col-span-3"><FormField id="telefoneCandidato" label="Telefone Principal"><IMaskInput mask="(00) 00000-0000" id="telefoneCandidato" name="telefoneCandidato" value={formData.telefoneCandidato || ''} onAccept={(value) => handleChange({ name: 'telefoneCandidato', value })} type="tel" className={inputClasses} /></FormField></div>
                            <div className="sm:col-span-3"><FormField id="telefone2Candidato" label="Telefone Secundário (Opcional)"><IMaskInput mask="(00) 00000-0000" id="telefone2Candidato" name="telefone2Candidato" value={formData.telefone2Candidato || ''} onAccept={(value) => handleChange({ name: 'telefone2Candidato', value })} type="tel" className={inputClasses} /></FormField></div>
                            <div className="sm:col-span-3"><FormField id="sexoCandidato" label="Sexo"><select name="sexoCandidato" id="sexoCandidato" value={formData.sexoCandidato || ''} onChange={handleChange} className={inputClasses}><option value="">Selecione</option><option value="Masculino">Masculino</option><option value="Feminino">Feminino</option><option value="Outro">Outro</option></select></FormField></div>
                            {formData.sexoCandidato === 'Outro' && <div className="sm:col-span-3"><FormField id="outrosexoCandidato" label="Especifique"><input type="text" name="outrosexoCandidato" id="outrosexoCandidato" value={formData.outrosexoCandidato || ''} onChange={handleChange} className={inputClasses} /></FormField></div>}
                            <div className="sm:col-span-3"><FormField id="estadocivilCandidato" label="Estado Civil"><select name="estadocivilCandidato" id="estadocivilCandidato" value={formData.estadocivilCandidato || ''} onChange={handleChange} className={inputClasses}><option value="">Selecione</option><option value="Solteiro(a)">Solteiro(a)</option><option value="Casado(a)">Casado(a)</option><option value="Divorciado(a)">Divorciado(a)</option><option value="Viúvo(a)">Viúvo(a)</option><option value="União Estável">União Estável</option></select></FormField></div>
                            <div className="sm:col-span-3"><FormField id="parentescoCandidato" label="Possui parente na empresa?"><select name="parentescoCandidato" id="parentescoCandidato" value={formData.parentescoCandidato as string} onChange={handleChange} className={inputClasses}><option value="Não">Não</option><option value="Sim">Sim</option></select></FormField></div>
                            {formData.parentescoCandidato === 'Sim' && (<div className="sm:col-span-full"><FormField id="graudeparentescoenomeCandidato" label="Qual o nome e o grau de parentesco?"><input type="text" name="graudeparentescoenomeCandidato" id="graudeparentescoenomeCandidato" value={formData.graudeparentescoenomeCandidato || ''} onChange={handleChange} className={inputClasses} placeholder="Ex: João da Silva (Primo)" /></FormField></div>)}
                        </div>
                    </section>
                )}

                {activeTab === 'documentos' && (<section><h2 className="text-xl font-semibold text-gray-700 border-b pb-4 mb-6">Documentos e Redes Sociais</h2><div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-6">
                    <div className="sm:col-span-3"><FormField id="cpfCandidato" label="CPF"><IMaskInput mask="000.000.000-00" id="cpfCandidato" name="cpfCandidato" value={formData.cpfCandidato as string} onAccept={(value) => handleChange({ name: 'cpfCandidato', value })} type="text" className={inputClasses} /></FormField></div>
                    <div className="sm:col-span-3"><FormField id="rgCandidato" label="RG"><IMaskInput mask="00.000.000-0" id="rgCandidato" name="rgCandidato" value={formData.rgCandidato as string} onAccept={(value) => handleChange({ name: 'rgCandidato', value })} type="text" className={inputClasses} /></FormField></div>
                    <div className="sm:col-span-3"><FormField id="cnhCandidato" label="Possui CNH?"><select name="cnhCandidato" id="cnhCandidato" value={formData.cnhCandidato as string} onChange={handleChange} className={inputClasses}><option value="">Selecione</option><option value="Sim">Sim</option><option value="Não">Não</option></select></FormField></div>
                    {formData.cnhCandidato === 'Sim' && <div className="sm:col-span-3"><FormField id="categoriacnhCandidato" label="Categoria CNH"><select name="categoriacnhCandidato" id="categoriacnhCandidato" value={formData.categoriacnhCandidato as string} onChange={handleChange} className={inputClasses}><option value="">Selecione</option><option value="A">A</option><option value="B">B</option><option value="AB">AB</option><option value="C">C</option><option value="D">D</option><option value="E">E</option></select></FormField></div>}
                    <div className="sm:col-span-3"><FormField id="pcdCandidato" label="Pessoa com Deficiência (PCD)?"><select name="pcdCandidato" id="pcdCandidato" value={formData.pcdCandidato as string} onChange={handleChange} className={inputClasses}><option value="">Selecione</option><option value="Sim">Sim</option><option value="Não">Não</option></select></FormField></div>
                    {formData.pcdCandidato === 'Sim' && <div className="sm:col-span-3"><FormField id="cidareacandidato" label="Qual o CID?"><input type="text" name="cidareacandidato" id="cidareacandidato" value={formData.cidareacandidato as string} onChange={handleChange} className={inputClasses} /></FormField></div>}
                    <div className="sm:col-span-full border-t border-gray-900/10"></div>
                    <div className="sm:col-span-2"><FormField id="linkedinCandidato" label="LinkedIn"><input type="url" name="linkedinCandidato" id="linkedinCandidato" value={formData.linkedinCandidato as string} onChange={handleChange} placeholder="https://linkedin.com/in/..." className={inputClasses} /></FormField></div>
                    <div className="sm:col-span-2"><FormField id="facebookCandidato" label="Facebook"><input type="url" name="facebookCandidato" id="facebookCandidato" value={formData.facebookCandidato as string} onChange={handleChange} placeholder="https://facebook.com/..." className={inputClasses} /></FormField></div>
                    <div className="sm:col-span-2"><FormField id="instagramCandidato" label="Instagram"><input type="url" name="instagramCandidato" id="instagramCandidato" value={formData.instagramCandidato as string} onChange={handleChange} placeholder="https://instagram.com/..." className={inputClasses} /></FormField></div>
                </div></section>)}

                {activeTab === 'endereco' && (<section><h2 className="text-xl font-semibold text-gray-700 border-b pb-4 mb-6">Endereço</h2><div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-6">
                    <div className="sm:col-span-2"><FormField id="cepCandidato" label="CEP"><IMaskInput mask="00000-000" id="cepCandidato" name="cepCandidato" value={formData.cepCandidato as string} onAccept={(value) => handleChange({ name: 'cepCandidato', value })} onBlur={buscarCep} type="text" placeholder="00000-000" className={inputClasses} /></FormField></div>
                    <div className="sm:col-span-4"><FormField id="ruaCandidato" label="Rua"><input type="text" name="ruaCandidato" id="ruaCandidato" value={formData.ruaCandidato as string} onChange={handleChange} className={inputClasses} /></FormField></div>
                    <div className="sm:col-span-2"><FormField id="numeroCandidato" label="Número"><input type="text" name="numeroCandidato" id="numeroCandidato" value={formData.numeroCandidato as string} onChange={handleChange} className={inputClasses} /></FormField></div>
                    <div className="sm:col-span-4"><FormField id="bairroCandidato" label="Bairro"><input type="text" name="bairroCandidato" id="bairroCandidato" value={formData.bairroCandidato as string} onChange={handleChange} className={inputClasses} /></FormField></div>
                    <div className="sm:col-span-3"><FormField id="cidadeCandidato" label="Cidade"><input type="text" name="cidadeCandidato" id="cidadeCandidato" value={formData.cidadeCandidato as string} onChange={handleChange} className={inputClasses} /></FormField></div>
                    <div className="sm:col-span-3"><FormField id="estadoCandidato" label="Estado"><input type="text" name="estadoCandidato" id="estadoCandidato" value={formData.estadoCandidato as string} onChange={handleChange} className={inputClasses} /></FormField></div>
                </div></section>)}

                {activeTab === 'formacao' && (<section><h2 className="text-xl font-semibold text-gray-700 border-b pb-4 mb-6">Formação e Habilidades</h2><div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
                    <FormField id="escolaridadeCandidato" label="Escolaridade"><select name="escolaridadeCandidato" id="escolaridadeCandidato" value={formData.escolaridadeCandidato as string} onChange={handleChange} className={inputClasses}><option value="">Selecione</option><option value="Ensino Fundamental">Ensino Fundamental</option><option value="Ensino Médio">Ensino Médio</option><option value="Ensino Técnico">Ensino Técnico</option><option value="Ensino Superior">Ensino Superior</option><option value="Pós-Graduação">Pós-Graduação</option><option value="Mestrado">Mestrado</option><option value="Doutorado">Doutorado</option></select></FormField>
                    <FormField id="vagainteresseCandidato" label="Vaga de Interesse"><select name="vagainteresseCandidato" id="vagainteresseCandidato" value={formData.vagainteresseCandidato as string} onChange={handleChange} className={inputClasses}><option value="">Selecione</option><option value="Administrativo">Administrativo</option><option value="Reposição">Reposição</option><option value="Expedição">Expedição</option><option value="Recebimento">Recebimento</option><option value="Entrega">Entrega</option><option value="Financeiro">Financeiro</option><option value="Compras">Compras</option><option value="Fiscal">Fiscal</option><option value="Vendas">Vendas</option><option value="Marketing">Marketing</option><option value="Conferência">Conferência</option><option value="RH">RH</option><option value="TI">TI</option></select></FormField>
                    <div className="md:col-span-2"><FormField id="conhecimentosCandidato" label="Diferencial / Resumo Profissional"><textarea name="conhecimentosCandidato" id="conhecimentosCandidato" value={formData.conhecimentosCandidato as string} onChange={handleChange} rows={4} className={inputClasses} /></FormField></div>
                    <div className="md:col-span-2 space-y-4 rounded-lg border border-gray-200 p-4"><h3 className="text-base font-semibold text-gray-800">Conhecimentos em Informática</h3><div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <FormField id="wordCandidato" label="Word"><select name="wordCandidato" value={formData.wordCandidato as string} onChange={handleChange} className={inputClasses}><option value="Desconheço">Desconheço</option><option value="Básico">Básico</option><option value="Intermediário">Intermediário</option><option value="Avançado">Avançado</option></select></FormField>
                        <FormField id="excelCandidato" label="Excel"><select name="excelCandidato" value={formData.excelCandidato as string} onChange={handleChange} className={inputClasses}><option value="Desconheço">Desconheço</option><option value="Básico">Básico</option><option value="Intermediário">Intermediário</option><option value="Avançado">Avançado</option></select></FormField>
                        <FormField id="powerpointCandidato" label="PowerPoint"><select name="powerpointCandidato" value={formData.powerpointCandidato as string} onChange={handleChange} className={inputClasses}><option value="Desconheço">Desconheço</option><option value="Básico">Básico</option><option value="Intermediário">Intermediário</option><option value="Avançado">Avançado</option></select></FormField>
                    </div><div className="pt-4"><label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Outras Ferramentas</label><div className="grid grid-cols-2 gap-x-4 gap-y-2"> {['AutoCAD', 'Corel Draw', 'Photoshop', 'Programação', 'Edição de Vídeos', 'Outros'].map(opcao => (<label key={opcao} className="flex items-center gap-2 text-sm text-gray-800 font-medium"><input type="checkbox" name="conhecimentosinformaticaCandidato" value={opcao} checked={formData.conhecimentosinformaticaCandidato.includes(opcao)} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />{opcao}</label>))}</div></div>
                        {formData.conhecimentosinformaticaCandidato.includes('Outros') && <div className="pt-2"><FormField id="conhecimentoinfcandidato" label="Especifique outros conhecimentos"><textarea name="conhecimentoinfcandidato" value={formData.conhecimentoinfcandidato as string} onChange={handleChange} rows={2} className={inputClasses} /></FormField></div>}
                    </div></div></section>)}

                {activeTab === 'experiencia' && (<section><h2 className="text-xl font-semibold text-gray-700 border-b pb-4 mb-6">Experiência Profissional</h2><FormField id="possuiexperienciaCandidato" label="Possui experiência profissional?"><select name="possuiexperienciaCandidato" id="possuiexperienciaCandidato" value={formData.possuiexperienciaCandidato} onChange={handleChange} className="block w-full max-w-sm rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"><option value="">Selecione</option><option value="Sim">Sim</option><option value="Não">Não</option></select></FormField>{formData.possuiexperienciaCandidato === 'Sim' && (<div className="space-y-8 mt-6">{[...Array(visibleExperiences)].map((_, i) => <ExperienciaFields key={i} index={i + 1} formData={formData} handleChange={handleChange} />)}{visibleExperiences < 3 && (<div className="flex justify-center"><button type="button" onClick={handleAddExperience} className="inline-flex items-center gap-2 rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"><PlusCircle size={16} />Adicionar mais experiência</button></div>)}</div>)}</section>)}

                {/* Aba Final (sem alterações) */}
                {activeTab === 'outros' && (<section className="space-y-6 text-center"><CheckCircle className="mx-auto h-16 w-16 text-green-500" /><h2 className="text-2xl font-semibold text-gray-800">Tudo pronto!</h2><p className="text-gray-600">Revise suas informações se necessário clicando nas etapas acima. <br /> Quando estiver tudo certo, clique no botão abaixo para enviar sua candidatura.</p><div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-gray-50 p-4 text-left"><h3 className="font-semibold text-gray-900">Suas Informações:</h3><p className="text-sm text-gray-600"><span className="font-medium">Nome:</span> {formData.nomeCandidato || 'Não preenchido'}</p><p className="text-sm text-gray-600"><span className="font-medium">Email:</span> {formData.emailCandidato || 'Não preenchido'}</p></div></section>)}

                <div className="flex items-center justify-between border-t border-gray-900/10 pt-6">
                    <div>{activeTab !== 'pessoal' && (<button type="button" onClick={() => handleTabNavigation('prev')} className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"><ArrowLeft size={16} /> Anterior</button>)}</div>
                    <div>{activeTab !== 'outros' ? (<button type="button" onClick={() => handleTabNavigation('next')} className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Próximo <ArrowRight size={16} /></button>) : (<button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50">{loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando...</> : 'Enviar Candidatura'}</button>)}</div>
                </div>
            </form>
        </div>
    );
}
