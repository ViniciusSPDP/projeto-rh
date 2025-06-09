'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { UserPlus, Save, LoaderCircle, ArrowLeft, Image as ImageIcon, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Componente auxiliar para os campos do formulário
function FormField({ label, children, required = false }: { label: string, children: React.ReactNode, required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  )
}

/**
 * Função auxiliar para comprimir a imagem no navegador antes do upload.
 * @param file O arquivo de imagem original.
 * @param maxWidth A largura máxima desejada para a imagem.
 * @param quality A qualidade da compressão (0 a 1).
 * @returns Uma Promise que resolve com a string Base64 da imagem comprimida.
 */
function compressImage(file: File, maxWidth: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Não foi possível obter o contexto do canvas.'));
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        const base64String = compressedDataUrl.split(',')[1];
        resolve(base64String);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}

export default function NovoUsuarioPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    autorizado: true,
    fotourl: '',
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Função que lida com a seleção e compressão da foto
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione um arquivo de imagem válido.');
        return;
    }

    try {
        toast.loading('Comprimindo imagem...');
        // Comprime a imagem com largura máxima de 400px e 75% de qualidade
        const compressedBase64 = await compressImage(file, 400, 0.75);
        toast.dismiss();
        
        // Atualiza o preview e o estado com a imagem comprimida
        setPhotoPreview(`data:image/jpeg;base64,${compressedBase64}`);
        setFormData(prev => ({ ...prev, fotourl: compressedBase64 }));

    } catch (error) {
        toast.dismiss();
        toast.error('Falha ao processar a imagem.');
        console.error('Erro de compressão:', error);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setFormData(prev => ({ ...prev, fotourl: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nome || !formData.email || !formData.senha) {
      toast.error('Nome, e-mail e senha são obrigatórios.');
      return;
    }

    setLoading(true)
    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json();

      if (res.ok) {
        toast.success(`Usuário "${data.nome}" criado com sucesso!`);
        router.push('/perfil/usuarios');
        router.refresh();
      } else {
        toast.error(data.error || 'Não foi possível criar o usuário.');
      }
    } catch (error) {
      toast.error('Ocorreu um erro de comunicação.');
    } finally {
      setLoading(false)
    }
  }

  const inputClasses = "block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5"

  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <div className="mb-6">
        <Link href="/perfil/usuarios" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900">
          <ArrowLeft size={16} />
          Voltar para o Usuários
        </Link>
      </div>
      <div className="flex items-center space-x-3 mb-8">
        <UserPlus className="h-8 w-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-800">Cadastrar Novo Usuário</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Nome Completo" required>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} required className={inputClasses} />
            </FormField>
            <FormField label="E-mail" required>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClasses} />
            </FormField>
          </div>
          
          <FormField label="Senha Provisória" required>
            <input type="password" name="senha" value={formData.senha} onChange={handleChange} required className={inputClasses} />
          </FormField>

          <FormField label="Foto de Perfil (Opcional)">
            <div className="flex items-center gap-4">
              {photoPreview ? (
                <div className="relative">
                  <Image src={photoPreview} alt="Prévia" width={64} height={64} className="h-16 w-16 rounded-full object-cover"/>
                  <button type="button" onClick={removePhoto} className="absolute -top-1 -right-1 rounded-full bg-white p-0.5 text-gray-500 shadow-sm hover:bg-gray-100">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <ImageIcon size={32} />
                </div>
              )}
              <label htmlFor="photo-upload" className="cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                <span>{photoPreview ? 'Trocar foto' : 'Enviar foto'}</span>
                <input id="photo-upload" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
              </label>
            </div>
          </FormField>

          <div className="border-t pt-6">
            <div className="relative flex items-start">
              <div className="flex h-6 items-center">
                <input
                  id="autorizado"
                  name="autorizado"
                  type="checkbox"
                  checked={formData.autorizado}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
              </div>
              <div className="ml-3 text-sm leading-6">
                <label htmlFor="autorizado" className="font-medium text-gray-900">
                  Usuário Autorizado
                </label>
                <p className="text-gray-500">Permitir que este usuário acesse o sistema imediatamente.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-8 mt-8 border-t border-gray-200">
          <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50">
            {loading ? ( <><LoaderCircle className="h-5 w-5 animate-spin" /> Salvando...</> ) : ( <><Save className="h-5 w-5" /> Cadastrar Usuário</> )}
          </button>
        </div>
      </form>
    </div>
  )
}
