'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { User, FileText, Mail, Phone, MapPin, Briefcase, Loader2, UploadCloud, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';

// Funções de máscara personalizadas
const masks = {
  cpf: (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  },
  
  phone: (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
      .replace(/(-\d{4})\d+?$/, '$1');
  },
  
  cep: (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  }
};

export default function CandidatarSePage() {
  const router = useRouter();
  
  const cargosDisponiveis = [
    "Administrativo", "Reposição", "Expedição", "Recebimento", "Entrega", 
    "Financeiro", "Compras", "Fiscal", "Vendas", "Marketing", 
    "Conferência", "RH", "TI"
  ];

  const [formData, setFormData] = useState({
    nome: '', cpf: '', email: '', telefone: '', cargo: '',
    cep: '', rua: '', numero: '', bairro: '', cidade: '', estado: '',
  });
  const [curriculo, setCurriculo] = useState<File | null>(null);
  const [declaracao, setDeclaracao] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Aplicar máscaras
    if (name === 'cpf') {
      formattedValue = masks.cpf(value);
    } else if (name === 'telefone') {
      formattedValue = masks.phone(value);
    } else if (name === 'cep') {
      formattedValue = masks.cep(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleCepBlur = useCallback(async () => {
    const cepLimpo = formData.cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Erro na consulta do CEP');
      }
      
      const data = await response.json();
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          rua: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || '',
        }));
        toast.success('CEP encontrado!');
      } else {
        toast.error('CEP não encontrado.');
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      toast.error('Não foi possível buscar o CEP. Verifique sua conexão.');
    }
  }, [formData.cep]);

  const validateFile = (file: File): string | null => {
    // Validar tipo MIME
    if (file.type !== 'application/pdf') {
      return 'Apenas arquivos PDF são aceitos.';
    }
    
    // Validar extensão
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return 'O arquivo deve ter extensão .pdf';
    }
    
    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return 'O arquivo deve ter no máximo 5MB.';
    }
    
    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setCurriculo(null);
      return;
    }
    
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      e.target.value = ''; // Limpar input
      setCurriculo(null);
      return;
    }
    
    setCurriculo(file);
    toast.success('Arquivo PDF selecionado com sucesso!');
  };

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!declaracao) {
      toast.error("Você precisa concordar com a declaração para continuar.");
      return;
    }
    
    if (!curriculo) {
      toast.error("Anexar o currículo é obrigatório.");
      return;
    }

    // Validação final do arquivo
    const fileError = validateFile(curriculo);
    if (fileError) {
      toast.error(fileError);
      return;
    }
    
    setIsLoading(true);
    
    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, value);
    });
    submissionData.append('curriculo', curriculo);

    try {
      const response = await fetch('/api/candidaturas', {
        method: 'POST',
        body: submissionData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Falha ao enviar candidatura.');
      }
      
      toast.success('Candidatura enviada com sucesso! Boa sorte!');
      
      // Reset form
      setFormData({
        nome: '', cpf: '', email: '', telefone: '', cargo: '',
        cep: '', rua: '', numero: '', bairro: '', cidade: '', estado: '',
      });
      setCurriculo(null);
      setDeclaracao(false);
      setCurrentStep(1);
      
      setTimeout(() => router.push('/'), 2000); 

    } catch (error: unknown) {
      console.error('Erro no envio:', error);
      if (error instanceof Error) {
        toast.error(`Erro: ${error.message}`);
      } else {
        toast.error('Ocorreu um erro desconhecido.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData, curriculo, declaracao, router]);

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.nome && formData.cpf && formData.email && formData.telefone);
      case 2:
        return !!(formData.cep && formData.rua && formData.numero && formData.bairro && formData.cidade && formData.estado);
      case 3:
        return !!(formData.cargo && curriculo);
      default:
        return false;
    }
  };

  const StepIndicator = ({ step, title, isActive, isCompleted }: { step: number, title: string, isActive: boolean, isCompleted: boolean }) => (
    <div className="flex items-center">
      <div className={`
        flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
        ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 
          isActive ? 'bg-blue-600 border-blue-600 text-white' : 
          'bg-gray-100 border-gray-300 text-gray-400'}
      `}>
        {isCompleted ? <CheckCircle className="w-5 h-5" /> : step}
      </div>
      <div className="ml-3">
        <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-gray-400'}`}>
          {title}
        </p>
      </div>
    </div>
  );

  return (
    <>
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">Trabalhe Conosco</h1>
              <p className="text-blue-100 text-lg">Faça parte da nossa equipe de sucesso</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Progress Steps */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex justify-between items-center">
              <StepIndicator 
                step={1} 
                title="Dados Pessoais" 
                isActive={currentStep === 1} 
                isCompleted={isStepValid(1)} 
              />
              <div className="flex-1 h-1 bg-gray-200 mx-4 rounded-full">
                <div className={`h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ${isStepValid(1) ? 'w-full' : 'w-0'}`}></div>
              </div>
              <StepIndicator 
                step={2} 
                title="Endereço" 
                isActive={currentStep === 2} 
                isCompleted={isStepValid(2)} 
              />
              <div className="flex-1 h-1 bg-gray-200 mx-4 rounded-full">
                <div className={`h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ${isStepValid(2) ? 'w-full' : 'w-0'}`}></div>
              </div>
              <StepIndicator 
                step={3} 
                title="Vaga & Currículo" 
                isActive={currentStep === 3} 
                isCompleted={isStepValid(3)} 
              />
            </div>
          </div>

          {/* Main Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              
              {/* Step 1: Personal Information */}
              <div className={`space-y-6 transition-all duration-500 ${currentStep === 1 ? 'block' : 'hidden'}`}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Informações Pessoais</h2>
                  <p className="text-gray-600">Vamos começar com seus dados básicos</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                      <input 
                        type="text" 
                        name="nome" 
                        value={formData.nome} 
                        onChange={handleInputChange} 
                        placeholder="Digite seu nome completo"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                        required 
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                      <input 
                        type="text" 
                        name="cpf" 
                        value={formData.cpf} 
                        onChange={handleInputChange} 
                        placeholder="000.000.000-00"
                        maxLength={14}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                        required 
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        placeholder="seu@email.com"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                        required 
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                      <input 
                        type="tel" 
                        name="telefone" 
                        value={formData.telefone} 
                        onChange={handleInputChange} 
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    disabled={!isStepValid(1)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                  >
                    Próximo <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Step 2: Address */}
              <div className={`space-y-6 transition-all duration-500 ${currentStep === 2 ? 'block' : 'hidden'}`}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Endereço</h2>
                  <p className="text-gray-600">Informe seu endereço completo</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                      <input 
                        type="text" 
                        name="cep" 
                        value={formData.cep} 
                        onChange={handleInputChange} 
                        onBlur={handleCepBlur} 
                        placeholder="00000-000"
                        maxLength={9}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                        required 
                      />
                    </div>
                  </div>

                  <div className="group md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rua</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                      <input 
                        type="text" 
                        name="rua" 
                        value={formData.rua} 
                        onChange={handleInputChange} 
                        placeholder="Nome da rua"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                        required 
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                    <input 
                      type="text" 
                      name="numero" 
                      value={formData.numero} 
                      onChange={handleInputChange} 
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                      required 
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                    <input 
                      type="text" 
                      name="bairro" 
                      value={formData.bairro} 
                      onChange={handleInputChange} 
                      placeholder="Nome do bairro"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                      required 
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                    <input 
                      type="text" 
                      name="cidade" 
                      value={formData.cidade} 
                      onChange={handleInputChange} 
                      placeholder="Nome da cidade"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                      required 
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <input 
                      type="text" 
                      name="estado" 
                      value={formData.estado} 
                      onChange={handleInputChange} 
                      placeholder="UF"
                      maxLength={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                      required 
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    disabled={!isStepValid(2)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                  >
                    Próximo <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Step 3: Job & Resume */}
              <div className={`space-y-6 transition-all duration-500 ${currentStep === 3 ? 'block' : 'hidden'}`}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Vaga & Currículo</h2>
                  <p className="text-gray-600">Escolha a vaga e anexe seu currículo em PDF</p>
                </div>

                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cargo Pretendido</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500 z-10" />
                      <select 
                        name="cargo" 
                        required 
                        value={formData.cargo} 
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white appearance-none"
                      >
                        <option value="" disabled>Selecione o cargo pretendido</option>
                        {cargosDisponiveis.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Currículo (APENAS PDF)
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    
                    {/* Aviso sobre formato */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">Importante:</p>
                          <p className="text-sm text-amber-700">
                            Apenas arquivos PDF são aceitos. Máximo 5MB.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200 bg-gray-50 hover:bg-blue-50">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <div className="space-y-2">
                          <div className="flex justify-center">
                            <label htmlFor="file-upload" className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                              <span>Escolher arquivo PDF</span>
                              <input 
                                id="file-upload" 
                                name="curriculo" 
                                type="file" 
                                className="sr-only" 
                                required 
                                onChange={handleFileChange} 
                                accept="application/pdf,.pdf" 
                              />
                            </label>
                          </div>
                          {curriculo ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <p className="text-sm font-medium text-green-800 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                {curriculo.name}
                              </p>
                              <p className="text-xs text-green-600 mt-1">
                                {(curriculo.size / 1024 / 1024).toFixed(2)} MB - PDF válido
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Apenas PDF • Máximo 5MB</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <input 
                        id="declaracao" 
                        name="declaracao" 
                        type="checkbox" 
                        className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                        checked={declaracao} 
                        onChange={(e) => setDeclaracao(e.target.checked)} 
                      />
                      <label htmlFor="declaracao" className="text-sm text-gray-700 leading-relaxed">
                        <span className="font-medium">DECLARO</span> que todas as informações fornecidas são verdadeiras e estou ciente de que declarações falsas implicarão na eliminação do processo seletivo. Autorizo o uso dos meus dados para fins de recrutamento e seleção.
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200"
                  >
                    Voltar
                  </button>
                  <button 
                    type="submit" 
                    disabled={!declaracao || !curriculo || isLoading || !isStepValid(3)} 
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 min-w-[200px] justify-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Enviar Candidatura
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}