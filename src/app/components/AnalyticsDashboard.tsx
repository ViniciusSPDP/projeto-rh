import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, FileText, Send, Clock, AlertTriangle } from 'lucide-react';

interface EstatisticasFormulario {
  tipo: string;
  aberturas: number;
  preenchimentos: number;
  envios: number;
  taxaPreenchimento: number;
  taxaEnvio: number;
  taxaConversaoTotal: number;
  tempoMedio: number;
  principaisAbandonos: Array<{ etapa: string; count: number }>;
}

interface DadosAnalytics {
  uploadCurriculo: EstatisticasFormulario;
  manualDados: EstatisticasFormulario;
  periodo: string;
  dataInicio: string;
  dataFim: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  trend?: number;
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {trend !== undefined && (
      <div className="mt-4 flex items-center">
        <TrendingUp className={`w-4 h-4 mr-1 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`} />
        <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
        <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
      </div>
    )}
  </div>
);

export default function AnalyticsDashboard() {
  const [dados, setDados] = useState<DadosAnalytics | null>(null);
  const [periodo, setPeriodo] = useState<'hoje' | 'semana' | 'mes' | 'total'>('mes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, [periodo]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/stats?periodo=${periodo}`);
      if (response.ok) {
        const data = await response.json();
        setDados(data);
      }
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Erro ao carregar dados</p>
        </div>
      </div>
    );
  }

  const totalAberturas = dados.uploadCurriculo.aberturas + dados.manualDados.aberturas;
  const totalEnvios = dados.uploadCurriculo.envios + dados.manualDados.envios;
  const taxaConversaoGeral = totalAberturas > 0 ? (totalEnvios / totalAberturas) * 100 : 0;

  // Dados para gráficos
  const dadosComparacao = [
    {
      formulario: 'Upload Currículo',
      aberturas: dados.uploadCurriculo.aberturas,
      preenchimentos: dados.uploadCurriculo.preenchimentos,
      envios: dados.uploadCurriculo.envios,
    },
    {
      formulario: 'Dados Manuais',
      aberturas: dados.manualDados.aberturas,
      preenchimentos: dados.manualDados.preenchimentos,
      envios: dados.manualDados.envios,
    }
  ];

  const dadosFunil = [
    { name: 'Aberturas', upload: dados.uploadCurriculo.aberturas, manual: dados.manualDados.aberturas },
    { name: 'Preenchimentos', upload: dados.uploadCurriculo.preenchimentos, manual: dados.manualDados.preenchimentos },
    { name: 'Envios', upload: dados.uploadCurriculo.envios, manual: dados.manualDados.envios },
  ];

  const dadosConversao = [
    { name: 'Upload Currículo', value: dados.uploadCurriculo.taxaConversaoTotal },
    { name: 'Dados Manuais', value: dados.manualDados.taxaConversaoTotal },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics dos Formulários</h1>
              <p className="text-gray-600 mt-1">Acompanhe o desempenho dos seus formulários de candidatura</p>
            </div>
            
            {/* Seletor de período */}
            <div className="flex gap-2">
              {(['hoje', 'semana', 'mes', 'total'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodo(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    periodo === p
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total de Aberturas"
            value={totalAberturas}
            subtitle="Pessoas que acessaram os formulários"
            icon={Users}
            color="bg-blue-500"
          />
          <MetricCard
            title="Total de Envios"
            value={totalEnvios}
            subtitle="Formulários completados"
            icon={Send}
            color="bg-green-500"
          />
          <MetricCard
            title="Taxa de Conversão"
            value={`${taxaConversaoGeral.toFixed(1)}%`}
            subtitle="Aberturas que viraram envios"
            icon={TrendingUp}
            color="bg-purple-500"
          />
          <MetricCard
            title="Tempo Médio"
            value={`${Math.round((dados.uploadCurriculo.tempoMedio + dados.manualDados.tempoMedio) / 2)}s`}
            subtitle="Para completar formulários"
            icon={Clock}
            color="bg-orange-500"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Funil de Conversão */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Funil de Conversão</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosFunil}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="upload" fill="#3B82F6" name="Upload Currículo" />
                <Bar dataKey="manual" fill="#10B981" name="Dados Manuais" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Taxa de Conversão por Tipo */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Taxa de Conversão por Tipo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosConversao}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosConversao.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detalhes por formulário */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Upload de Currículo */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Upload de Currículo</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{dados.uploadCurriculo.aberturas}</p>
                  <p className="text-sm text-gray-600">Aberturas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{dados.uploadCurriculo.preenchimentos}</p>
                  <p className="text-sm text-gray-600">Preenchimentos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{dados.uploadCurriculo.envios}</p>
                  <p className="text-sm text-gray-600">Envios</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Taxa de Preenchimento</p>
                    <p className="text-lg font-bold text-blue-600">{dados.uploadCurriculo.taxaPreenchimento.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Taxa de Envio</p>
                    <p className="text-lg font-bold text-green-600">{dados.uploadCurriculo.taxaEnvio.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-medium text-gray-700 mb-2">Tempo médio: {dados.uploadCurriculo.tempoMedio}s</p>
                <p className="font-medium text-gray-700 mb-2">Conversão total: {dados.uploadCurriculo.taxaConversaoTotal.toFixed(1)}%</p>
              </div>

              {dados.uploadCurriculo.principaisAbandonos.length > 0 && (
                <div className="border-t pt-4">
                  <p className="font-medium text-gray-700 mb-2">Principais pontos de abandono:</p>
                  <div className="space-y-1">
                    {dados.uploadCurriculo.principaisAbandonos.map((abandono, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{abandono.etapa}</span>
                        <span className="font-medium text-red-600">{abandono.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dados Manuais */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">Preenchimento Manual</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{dados.manualDados.aberturas}</p>
                  <p className="text-sm text-gray-600">Aberturas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{dados.manualDados.preenchimentos}</p>
                  <p className="text-sm text-gray-600">Preenchimentos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{dados.manualDados.envios}</p>
                  <p className="text-sm text-gray-600">Envios</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Taxa de Preenchimento</p>
                    <p className="text-lg font-bold text-blue-600">{dados.manualDados.taxaPreenchimento.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Taxa de Envio</p>
                    <p className="text-lg font-bold text-green-600">{dados.manualDados.taxaEnvio.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-medium text-gray-700 mb-2">Tempo médio: {dados.manualDados.tempoMedio}s</p>
                <p className="font-medium text-gray-700 mb-2">Conversão total: {dados.manualDados.taxaConversaoTotal.toFixed(1)}%</p>
              </div>

              {dados.manualDados.principaisAbandonos.length > 0 && (
                <div className="border-t pt-4">
                  <p className="font-medium text-gray-700 mb-2">Principais pontos de abandono:</p>
                  <div className="space-y-1">
                    {dados.manualDados.principaisAbandonos.map((abandono, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{abandono.etapa}</span>
                        <span className="font-medium text-red-600">{abandono.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comparação direta */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparação dos Formulários</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dadosComparacao} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formulario" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="aberturas" fill="#3B82F6" name="Aberturas" />
              <Bar dataKey="preenchimentos" fill="#F59E0B" name="Preenchimentos" />
              <Bar dataKey="envios" fill="#10B981" name="Envios" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insights e Recomendações */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Insights e Recomendações
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">📊 Análise de Performance</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• {dados.uploadCurriculo.taxaConversaoTotal > dados.manualDados.taxaConversaoTotal 
                  ? 'Upload de currículo tem melhor conversão' 
                  : 'Preenchimento manual tem melhor conversão'}</li>
                <li>• Taxa de conversão geral: {taxaConversaoGeral.toFixed(1)}%</li>
                <li>• {totalAberturas} pessoas interessadas no período</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-2">💡 Sugestões de Melhoria</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• {taxaConversaoGeral < 20 ? 'Considere simplificar o processo' : 'Boa taxa de conversão!'}</li>
                <li>• Analise os pontos de abandono para otimizar</li>
                <li>• {dados.uploadCurriculo.tempoMedio > 300 ? 'Formulário muito longo - considere reduzir' : 'Tempo de preenchimento adequado'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}