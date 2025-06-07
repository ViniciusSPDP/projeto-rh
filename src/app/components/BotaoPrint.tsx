'use client'

export default function BotaoPrint() {
  return (
    <button
      onClick={() => {
        // Aguarda dois frames para garantir renderização completa
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.print()
          })
        })
      }}
      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
    >
      Imprimir
    </button>
  )
}
