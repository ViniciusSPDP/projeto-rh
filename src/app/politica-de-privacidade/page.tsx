// src/app/politica-de-privacidade/page.tsx
import Link from 'next/link';
import { ShieldCheck, ChevronLeft } from 'lucide-react';

export const metadata = {
  title: 'Política de Privacidade | Conexão Distribuidora',
  description: 'Como tratamos os dados pessoais dos candidatos no processo de recrutamento e seleção (LGPD).',
};

const ATUALIZADO_EM = '22 de junho de 2026';
const CONTATO_LGPD = '+55 17 99681-9648 (WhatsApp)';

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-blue-800 mb-3">{titulo}</h2>
      <div className="space-y-2 text-gray-700 leading-relaxed">{children}</div>
    </section>
  );
}

export default function PoliticaDePrivacidadePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/candidatar-se" className="inline-flex items-center gap-1 text-sm text-blue-700 hover:text-blue-900 mb-6">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Política de Privacidade</h1>
          </div>
          <p className="text-sm text-gray-500 mb-8">
            Tratamento de dados de candidatos — recrutamento e seleção. Última atualização: {ATUALIZADO_EM}.
          </p>

          <Secao titulo="1. Quem é o controlador dos seus dados">
            <p>
              O controlador dos dados pessoais coletados neste sistema é a <strong>Conexão Distribuidora</strong>,
              inscrita no CNPJ <strong>03.883.810/0001-21</strong>, com sede na Av. Thessalônico Barbosa, 278 -
              Jardim Acapulco - Fernandópolis/SP - CEP 15.612-132.
            </p>
            <p>
              O sistema é desenvolvido e operado, em nome da Conexão, pela <strong>Vinicius Tecnologia LTDA</strong>
              (operadora), que trata os dados seguindo as instruções do controlador.
            </p>
            <p>
              <strong>Canal de contato para assuntos de privacidade e LGPD:</strong> {CONTATO_LGPD}.
            </p>
          </Secao>

          <Secao titulo="2. Quais dados coletamos">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Identificação:</strong> nome, CPF, RG, data de nascimento, sexo, estado civil e foto (quando enviada).</li>
              <li><strong>Contato:</strong> e-mail, telefone(s), endereço (CEP, rua, número, bairro, cidade, estado) e redes sociais (quando informadas).</li>
              <li><strong>Profissionais:</strong> escolaridade, conhecimentos, experiências anteriores (empresas, cargos e períodos), CNH e o <strong>currículo (PDF)</strong>.</li>
              <li><strong>Dados sensíveis:</strong> condição de Pessoa com Deficiência (PCD) e o respectivo CID, quando você opta por informar (ver seção 8).</li>
              <li><strong>Dados técnicos:</strong> identificador de sessão, endereço IP e navegador (user-agent), usados para métricas e segurança do formulário.</li>
            </ul>
          </Secao>

          <Secao titulo="3. Para que usamos seus dados (finalidade)">
            <p>Os dados são usados exclusivamente para fins de <strong>recrutamento e seleção</strong>, incluindo:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>avaliar sua candidatura e adequação às vagas;</li>
              <li>entrar em contato sobre o processo seletivo;</li>
              <li>conduzir as etapas do processo (triagem, entrevistas, decisão);</li>
              <li>manter seu cadastro em banco de talentos para oportunidades futuras.</li>
            </ul>
          </Secao>

          <Secao titulo="4. Base legal">
            <p>
              Tratamos seus dados com base no seu <strong>consentimento</strong> (art. 7º, I da LGPD) e na execução de
              <strong> procedimentos preliminares</strong> relacionados a um possível contrato de trabalho, a seu pedido
              (art. 7º, V). Para <strong>dados sensíveis</strong> (PCD/CID), o tratamento depende do seu
              <strong> consentimento específico e destacado</strong> (art. 11, I).
            </p>
          </Secao>

          <Secao titulo="5. Com quem compartilhamos">
            <p>
              Seus dados são de uso <strong>interno</strong> da Conexão Distribuidora para o processo seletivo. Podem ser
              acessados pela operadora de tecnologia (Vinicius Tecnologia LTDA) estritamente para manutenção do sistema.
              <strong> Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing.</strong>
            </p>
          </Secao>

          <Secao titulo="6. Como armazenamos e protegemos">
            <ul className="list-disc pl-5 space-y-1">
              <li>Os dados ficam em banco de dados de acesso restrito.</li>
              <li>Currículos e fotos ficam em <strong>armazenamento privado</strong>, acessível apenas por recrutadores autenticados, por meio de acesso temporário e controlado (não há link público).</li>
              <li>As transmissões usam conexão criptografada (HTTPS).</li>
              <li>O acesso administrativo exige autenticação.</li>
            </ul>
          </Secao>

          <Secao titulo="7. Por quanto tempo guardamos">
            <p>
              Mantemos seus dados pelo tempo necessário ao processo seletivo e, com seu consentimento, no banco de
              talentos por até <strong>24 meses</strong>, salvo se você solicitar a exclusão antes disso ou se houver
              obrigação legal de retenção.
            </p>
          </Secao>

          <Secao titulo="8. Dados sensíveis (PCD / CID)">
            <p>
              Informar se você é Pessoa com Deficiência (PCD) e o CID é <strong>opcional</strong>. Esses dados são
              sensíveis e usados apenas para adequação da vaga e cumprimento de cotas legais. Você pode se candidatar
              sem informá-los e pode solicitar a remoção a qualquer momento.
            </p>
          </Secao>

          <Secao titulo="9. Seus direitos (art. 18 da LGPD)">
            <p>Você pode, a qualquer momento, solicitar:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>confirmação da existência de tratamento e <strong>acesso</strong> aos seus dados;</li>
              <li><strong>correção</strong> de dados incompletos ou desatualizados;</li>
              <li><strong>anonimização, bloqueio ou exclusão</strong> de dados desnecessários ou tratados em desconformidade;</li>
              <li><strong>portabilidade</strong> e informação sobre compartilhamentos;</li>
              <li><strong>revogação do consentimento</strong> e exclusão dos dados.</li>
            </ul>
            <p>Para exercer seus direitos, entre em contato pelo canal: <strong>{CONTATO_LGPD}</strong>.</p>
          </Secao>

          <Secao titulo="10. Cookies e tecnologias">
            <p>
              Usamos um identificador de sessão e métricas de uso do formulário (incluindo IP e navegador) para
              segurança e melhoria do processo. Não usamos cookies para publicidade.
            </p>
          </Secao>

          <Secao titulo="11. Alterações desta política">
            <p>
              Esta política pode ser atualizada. A data da última atualização é indicada no topo. Mudanças relevantes
              serão comunicadas no formulário de candidatura.
            </p>
          </Secao>

          <div className="mt-10 pt-6 border-t border-gray-100 text-sm text-gray-500">
            <p><strong>Controlador:</strong> Conexão Distribuidora — CNPJ 03.883.810/0001-21 — Fernandópolis/SP.</p>
            <p><strong>Contato (LGPD):</strong> {CONTATO_LGPD}.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
