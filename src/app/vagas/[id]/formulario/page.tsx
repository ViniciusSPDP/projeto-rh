import FormCandidatoPublico from '@/app/components/FormCandidatoPublico'

export default function FormularioDaVaga({ params }: { params: { id: string } }) {
  const vagaId = Number(params.id)

  return (
    <main className="min-h-screen bg-blue-50 py-10 px-4">
      <FormCandidatoPublico vagaId={vagaId} />
    </main>
  )
}
