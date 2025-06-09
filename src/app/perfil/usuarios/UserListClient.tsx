'use client'

import { useState, useTransition } from 'react';
import type { UserForList } from './page';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { KeyRound, X, LoaderCircle, Save } from 'lucide-react';

// --- Sub-componente: Switch para autorizar/desautorizar ---
function ToggleAuth({ isAuthorized, onChange, disabled }: { isAuthorized: boolean, onChange: () => void, disabled: boolean }) {
  // ... Nenhuma alteração aqui ...
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`${isAuthorized ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
      role="switch"
      aria-checked={isAuthorized}
    >
      <span className={`${isAuthorized ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
    </button>
  );
}

// --- Sub-componente: Modal para trocar a senha ---
function ChangePasswordModal({ user, onClose, onSave }: { user: UserForList, onClose: () => void, onSave: (userId: number, newPass: string) => Promise<void> }) {
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, startTransition] = useTransition();

  const handleSave = () => {
    if (newPassword.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    startTransition(async () => {
      await onSave(user.id, newPassword);
    });
  };
  
  return (
    // 1. Fundo (Overlay)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      {/* 2. Janela do Modal */}
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Alterar Senha</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
        </div>
        <p className="text-sm text-gray-600 mb-4">Você está alterando a senha para o usuário <span className="font-semibold">{user.nome}</span>.</p>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 block p-3 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Mínimo de 6 caracteres"
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
          <button onClick={handleSave} disabled={isSaving} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50">
            {isSaving ? <LoaderCircle className="animate-spin" size={16}/> : <Save size={16}/>}
            Salvar Nova Senha
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Componente Principal da Lista de Usuários ---
export default function UserListClient({ initialUsers }: { initialUsers: UserForList[] }) {
    // ... Nenhuma alteração aqui ...
    const [users, setUsers] = useState(initialUsers);
    const [isUpdating, startTransition] = useTransition();
    const [selectedUserForPassword, setSelectedUserForPassword] = useState<UserForList | null>(null);

    const handleToggleAuth = async (userToUpdate: UserForList) => {
        startTransition(async () => {
            const newStatus = !userToUpdate.autorizado;
            const res = await fetch(`/api/usuarios/${userToUpdate.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ autorizado: newStatus })
            });
            if (res.ok) {
                toast.success(`Usuário ${newStatus ? 'autorizado' : 'desautorizado'} com sucesso.`);
                setUsers(currentUsers => 
                    currentUsers.map(u => u.id === userToUpdate.id ? {...u, autorizado: newStatus} : u)
                );
            } else {
                toast.error('Falha ao atualizar o status do usuário.');
            }
        });
    }

    const handlePasswordChange = async (userId: number, newPass: string) => {
        const res = await fetch(`/api/usuarios/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ senha: newPass })
        });

        if (res.ok) {
            toast.success('Senha alterada com sucesso!');
            setSelectedUserForPassword(null);
        } else {
            const data = await res.json();
            toast.error(data.error || 'Falha ao alterar a senha.');
        }
    }

    return (
        <div>
            <ul className="divide-y divide-gray-200">
                {users.map(user => (
                    <li key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
                        <div className="flex items-center gap-4">
                            <Image
                                src={user.fotourl ? `data:image/png;base64,${user.fotourl}` : '/user-placeholder.png'}
                                alt={`Foto de ${user.nome}`}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{user.nome}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 w-full sm:w-auto justify-end">
                            <div className="text-center">
                                <span className="text-xs text-gray-500">Autorizado</span>
                                <ToggleAuth
                                    isAuthorized={!!user.autorizado}
                                    onChange={() => handleToggleAuth(user)}
                                    disabled={isUpdating}
                                />
                            </div>
                            <button onClick={() => setSelectedUserForPassword(user)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                                <KeyRound size={16}/>
                                Alterar Senha
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {selectedUserForPassword && (
                <ChangePasswordModal
                    user={selectedUserForPassword}
                    onClose={() => setSelectedUserForPassword(null)}
                    onSave={handlePasswordChange}
                />
            )}
        </div>
    );
}