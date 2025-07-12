// src/app/api/vagas/[id]/fechar/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enviarMensagensEmLote } from '@/lib/whatsapp-service';

interface Context {
  params: {
    id: string;
  };
}

// SOLUÇÃO 1: Definir o tipo das mensagens
type TipoMensagem = 'CONTRATADO' | 'REPROVADO';

interface MensagemWhatsApp {
  numero: string;
  tipo: TipoMensagem;
  variaveis: {
    titulo: string;
    status: string;
    etapa: string;
    nomeCandidato: string;
    emailCandidato: string;
    cpfCandidato: string;
    telefoneCandidato: string;
    datanascimentoCandidato: string;
    rgCandidato: string;
    sexoCandidato: string;
    estadocivilCandidato: string;
    escolaridadeCandidato: string;
    situacaoCandidato: string;
    cepCandidato: string;
    ruaCandidato: string;
    numeroCandidato: string;
    bairroCandidato: string;
    cidadeCandidato: string;
    estadoCandidato: string;
    empresaCandidato: string;
    empresa2Candidato: string;
    empresa3Candidato: string;
  };
}

// Função auxiliar para formatar datas
const formatDate = (date: Date | null | undefined): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

export async function PATCH(req: NextRequest, context: Context) {
  const vagaId = Number(context.params.id);

  if (isNaN(vagaId)) {
    return NextResponse.json({ error: 'ID da vaga inválido' }, { status: 400 });
  }

  try {
    const resultado = await prisma.$transaction(async (tx) => {
      // Buscar dados da vaga
      const vaga = await tx.vaga.findUnique({
        where: { idVaga: vagaId },
        select: { idVaga: true, titulo: true, descricao: true, status: true }
      });

      if (!vaga) {
        throw new Error('Vaga não encontrada');
      }

      const candidatosDaVaga = await tx.vagaCandidato.findMany({
        where: { vagaId: vagaId },
        include: {
          candidato: true
        }
      });

      // SOLUÇÃO 2: Tipar o array corretamente
      const mensagensParaEnviar: MensagemWhatsApp[] = [];

      // Atualizar situação dos candidatos
      for (const vagaCandidato of candidatosDaVaga) {
        const novaSituacao = vagaCandidato.etapa === 'Contratado' ? 'Contratado' : 'Reprovado';
        // SOLUÇÃO 3: Usar type assertion ou definir explicitamente o tipo
        const tipoMensagem: TipoMensagem = novaSituacao === 'Contratado' ? 'CONTRATADO' : 'REPROVADO';

        // Atualiza a situação do candidato no banco de talentos geral
        await tx.candidatos.update({
          where: {
            idCandidato: vagaCandidato.candidatoId,
          },
          data: {
            situacaoCandidato: novaSituacao,
          },
        });

        const { candidato } = vagaCandidato;

        if (candidato?.telefoneCandidato && candidato?.nomeCandidato) {
          mensagensParaEnviar.push({
            numero: candidato.telefoneCandidato,
            tipo: tipoMensagem, // Agora está tipado corretamente
            variaveis: {
              // Dados da Vaga
              titulo: vaga.titulo || '',
              status: 'Encerrada',

              // Dados do Processo
              etapa: vagaCandidato.etapa || '',

              // Dados do Candidato
              nomeCandidato: candidato.nomeCandidato || '',
              emailCandidato: candidato.emailCandidato || '',
              cpfCandidato: candidato.cpfCandidato || '',
              telefoneCandidato: candidato.telefoneCandidato || '',
              datanascimentoCandidato: formatDate(candidato.datanascimentoCandidato) || '',
              rgCandidato: candidato.rgCandidato || '',
              sexoCandidato: candidato.sexoCandidato || '',
              estadocivilCandidato: candidato.estadocivilCandidato || '',
              escolaridadeCandidato: candidato.escolaridadeCandidato || '',
              situacaoCandidato: novaSituacao,

              // Endereço do Candidato
              cepCandidato: candidato.cepCandidato || '',
              ruaCandidato: candidato.ruaCandidato || '',
              numeroCandidato: candidato.numeroCandidato || '',
              bairroCandidato: candidato.bairroCandidato || '',
              cidadeCandidato: candidato.cidadeCandidato || '',
              estadoCandidato: candidato.estadoCandidato || '',

              // Experiência Profissional
              empresaCandidato: candidato.empresaCandidato || '',
              empresa2Candidato: candidato.empresa2Candidato || '',
              empresa3Candidato: candidato.empresa3Candidato || '',
            }
          });
        }
      }

      // Atualizar status da vaga para "Encerrada"
      const vagaAtualizada = await tx.vaga.update({
        where: { idVaga: vagaId },
        data: { status: 'Encerrada' },
      });

      return {
        vaga: vagaAtualizada,
        candidatos: candidatosDaVaga.length,
        mensagensPreparadas: mensagensParaEnviar
      };
    });

    // Enviar mensagens via WhatsApp (fora da transação)
    if (resultado.mensagensPreparadas.length > 0) {
      console.log(`Disparando envio de ${resultado.mensagensPreparadas.length} mensagens em segundo plano...`);

      // Agora não deve dar erro TypeScript
      enviarMensagensEmLote(resultado.mensagensPreparadas)
        .then(res => console.log('Resultado do envio em lote (background):', res))
        .catch(err => console.error('Erro no envio em lote (background):', err));
    }

    return NextResponse.json({
      vaga: resultado.vaga,
      candidatosAtualizados: resultado.candidatos,
      whatsapp: {
        info: 'O processo de encerramento foi concluído e as notificações estão sendo enviadas.',
        mensagensAgendadas: resultado.mensagensPreparadas.length
      }
    });

  } catch (error) {
    console.error('Erro ao encerrar vaga:', error);

    if (error instanceof Error && error.message.includes('Vaga não encontrada')) {
      return NextResponse.json({ error: 'Vaga não encontrada' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor ao tentar encerrar a vaga.' },
      { status: 500 }
    );
  }
}