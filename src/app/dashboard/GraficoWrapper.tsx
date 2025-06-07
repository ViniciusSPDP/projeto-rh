'use client'

import GraficoStatus from '../components/dashboard/GraficoStatus'

export default function GraficoWrapper({ dados }: { dados: { status: string, total: number }[] }) {
  return (
    <div className="h-full">
      <GraficoStatus dados={dados} />
    </div>
  )
}