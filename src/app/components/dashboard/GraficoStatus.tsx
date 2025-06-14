'use client'

// 1. Removido 'Pie' da importação, pois não estava sendo usado.
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem // 2. Importado o tipo TooltipItem
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface GraficoStatusProps {
    dados: { status: string, total: number }[];
}

export default function GraficoStatus({ dados }: GraficoStatusProps) {
  // Cores mais modernas e acessíveis
  const cores = [
    '#3b82f6', // azul moderno
    '#10b981', // verde esmeralda
    '#f59e0b', // âmbar
    '#ef4444', // vermelho
    '#8b5cf6', // roxo
    '#06b6d4', // ciano
    '#84cc16', // lima
    '#f97316', // laranja
  ]

  const chartData = {
    labels: dados.map((d) => d.status || 'Não definido'),
    datasets: [
      {
        label: 'Candidatos',
        data: dados.map((d) => d.total),
        backgroundColor: cores.slice(0, dados.length),
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverOffset: 8,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif',
          },
          color: '#374151',
        },
      },
      tooltip: {
        backgroundColor: '#374151',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#d1d5db',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
        callbacks: {
          // 3. Corrigido o tipo 'any' para o tipo específico do Chart.js
          label: function(context: TooltipItem<'doughnut'>) {
            const total = dados.reduce((sum, item) => sum + item.total, 0)
            const value = typeof context.raw === 'number' ? context.raw : 0;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            return `${context.label}: ${value} (${percentage}%)`
          }
        }
      },
    },
    layout: {
      padding: 20,
    },
  }

  const total = dados.reduce((sum, item) => sum + item.total, 0)

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Distribuição por Status</h2>
        <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Total: {total}
        </div>
      </div>
      
      <div className="relative h-80">
        <Doughnut data={chartData} options={options} />
      </div>

      <div className="mt-6 space-y-2">
        {dados.map((item, index) => {
          const percentage = total > 0 ? ((item.total / total) * 100).toFixed(1) : '0'
          return (
            <div key={item.status} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: cores[index % cores.length] }} // Evita erro se tiver mais dados que cores
                ></div>
                <span className="text-sm font-medium text-slate-700">{item.status}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-slate-800">{item.total}</span>
                <span className="text-xs text-slate-500">({percentage}%)</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
