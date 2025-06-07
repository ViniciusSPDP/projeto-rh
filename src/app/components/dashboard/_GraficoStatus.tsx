'use client'

import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function GraficoStatus({ dados }: { dados: { status: string, total: number }[] }) {
  const chartData = {
    labels: dados.map((d) => d.status || 'Não definido'),
    datasets: [
      {
        label: 'Candidatos por Situação',
        data: dados.map((d) => d.total),
        backgroundColor: [
          '#3b82f6', // azul
          '#10b981', // verde
          '#facc15', // amarelo
          '#ef4444', // vermelho
          '#6b7280', // cinza
        ],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-blue-800 mb-4">Distribuição por Situação</h2>
      <Pie data={chartData} />
    </div>
  )
}
