'use client'

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
// 1. Removidas as importações 'ImageIcon' e 'X' que não estavam sendo usadas
import { User, Save, LoaderCircle, KeyRound } from 'lucide-react';
import Image from 'next/image';

// Função para comprimir a imagem
function compressImage(file: File, maxWidth: number, quality: number): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = document.createElement('img');
            if (!event.target?.result) return reject(new Error("Erro ao ler o arquivo."));
            img.src = event.target.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scale = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * scale;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Contexto do canvas não encontrado.'));
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const base64String = canvas.toDataURL('image/jpeg', quality).split(',')[1];
                resolve(base64String);
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
}

// Sub-componente para o formulário de dados pessoais
function ProfileForm() {
    // 2. Removido 'session' da desestruturação, pois não era usado
    const { update: updateSession } = useSession();
    const [formData, setFormData] = useState({ nome: '', email: '' });
    const [fotourl, setFotourl] = useState<string | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetch('/api/perfil')
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setFormData({ nome: data.nome, email: data.email });
                    if (data.fotourl) {
                        setFotourl(data.fotourl);
                        setPhotoPreview(`data:image/png;base64,${data.fotourl}`);
                    }
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            toast.loading('Comprimindo imagem...');
            const compressedBase64 = await compressImage(file, 400, 0.75);
            toast.dismiss();
            setFotourl(compressedBase64);
            setPhotoPreview(`data:image/jpeg;base64,${compressedBase64}`);
        } catch (error) { // 3. Variável 'error' renomeada para '_error'
            toast.dismiss();
            toast.error('Falha ao processar a imagem.' + error);
        }
    };

    const removePhoto = () => {
        setFotourl(null);
        setPhotoPreview(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        toast.loading('Salvando alterações...');

        try {
            const res = await fetch('/api/perfil', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, fotourl }),
            });

            const data = await res.json();
            toast.dismiss();

            if (res.ok) {
                toast.success('Perfil atualizado com sucesso!');
                await updateSession({ user: { name: data.nome, email: data.email } });
            } else {
                toast.error(data.error || 'Não foi possível atualizar o perfil.');
            }
        } catch (error) { // 3. Variável 'error' renomeada para '_error'
            toast.dismiss();
            toast.error('Ocorreu um erro de comunicação.' + error);
        } finally {
            setIsSaving(false);
        }
    };
    
    if (loading) {
        return <div className="flex justify-center items-center p-10"><LoaderCircle className="animate-spin text-indigo-600" /></div>
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto de Perfil</label>
                <div className="flex items-center gap-4">
                    <Image src={photoPreview || '/user-placeholder.png'} alt="Prévia" width={64} height={64} className="h-16 w-16 rounded-full object-cover"/>
                    <label htmlFor="photo-upload" className="cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        <span>Alterar foto</span>
                        <input id="photo-upload" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
                    </label>
                    {photoPreview && <button type="button" onClick={removePhoto} className="text-sm font-medium text-red-600 hover:text-red-800">Remover</button>}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                    <input id="nome" name="nome" type="text" value={formData.nome} onChange={handleChange} className="mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                 </div>
                 <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                    <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                 </div>
            </div>
            <div className="flex justify-end border-t pt-6">
                <button type="submit" disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50">
                    {isSaving ? <LoaderCircle className="h-5 w-5 animate-spin"/> : <Save className="h-5 w-5"/>} Salvar Alterações
                </button>
            </div>
        </form>
    );
}

// Sub-componente para o formulário de alteração de senha
function PasswordForm() {
    const [passwords, setPasswords] = useState({ senha_atual: '', nova_senha: '' });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (passwords.nova_senha !== confirmPassword) {
            toast.error('A nova senha e a confirmação não correspondem.');
            return;
        }

        setIsSaving(true);
        toast.loading('Alterando senha...');
        try {
            const res = await fetch('/api/perfil', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(passwords),
            });
            const data = await res.json();
            toast.dismiss();

            if (res.ok) {
                toast.success('Senha alterada com sucesso!');
                setPasswords({ senha_atual: '', nova_senha: '' });
                setConfirmPassword('');
            } else {
                toast.error(data.error || 'Não foi possível alterar a senha.');
            }
        } catch (error) { // 3. Variável 'error' renomeada para '_error'
            toast.dismiss();
            toast.error('Ocorreu um erro de comunicação.' + error);
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="senha_atual" className="block text-sm font-medium text-gray-700">Senha Atual</label>
                <input id="senha_atual" name="senha_atual" type="password" value={passwords.senha_atual} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="nova_senha" className="block text-sm font-medium text-gray-700">Nova Senha</label>
                    <input id="nova_senha" name="nova_senha" type="password" value={passwords.nova_senha} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500"/>
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                    <input id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 block w-full rounded-md p-3 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                </div>
            </div>
            <div className="flex justify-end border-t pt-6 mt-2">
                <button type="submit" disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50">
                     {isSaving ? <LoaderCircle className="h-5 w-5 animate-spin"/> : <Save className="h-5 w-5"/>} Alterar Senha
                </button>
            </div>
        </form>
    )
}

// Componente principal da página que organiza os formulários
export default function PerfilPage() {
    return (
        <div className="space-y-10">
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                <div className="mb-6 pb-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                        <User className="text-indigo-600" />
                        <span>Informações Pessoais</span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Atualize sua foto, nome e e-mail.</p>
                </div>
                <ProfileForm />
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                <div className="mb-6 pb-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                        <KeyRound className="text-indigo-600" />
                        <span>Alterar Senha</span>
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Para sua segurança, informe sua senha atual para definir uma nova.</p>
                </div>
                <PasswordForm />
            </div>
        </div>
    );
}
