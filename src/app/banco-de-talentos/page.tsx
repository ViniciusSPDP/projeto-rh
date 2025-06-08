// src/app/banco-de-talentos/page.tsx

import FormCandidatoPublico from '@/app/components/FormCandidatoPublico'

export default function BancoDeTalentosPage() {
  return (
    // Usamos o mesmo layout de fundo das outras páginas públicas
    <main className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Note que estamos chamando o formulário sem passar o `vagaId`.
        É isso que o diferencia do formulário de uma vaga específica.
      */}
      <FormCandidatoPublico />
    </main>
  );
}