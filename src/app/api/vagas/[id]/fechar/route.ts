// src/app/api/vagas/[id]/fechar/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';
import { enviarMensagensEmLote } from '@/lib/whatsapp-service';
import { getWhatsAppConfig } from '@/lib/whatsappConfig'; // NOVO: 1. Importar a função de configuração

interface Context {
  params: {
    id: string;
  };
}

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

const formatDate = (date: Date | null | undefined): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

export async function PATCH(req: NextRequest, context: Context) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const vagaId = Number(context.params.id);

  if (isNaN(vagaId)) {
    return NextResponse.json({ error: 'ID da vaga inválido' }, { status: 400 });
  }

  try {
    // NOVO: 2. Obter a configuração do WhatsApp no início
    const whatsAppConfig = await getWhatsAppConfig();

    const resultado = await prisma.$transaction(async (tx) => {
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

      const mensagensParaEnviar: MensagemWhatsApp[] = [];

      for (const vagaCandidato of candidatosDaVaga) {
        const novaSituacao = vagaCandidato.etapa === 'Contratado' ? 'Contratado' : 'Reprovado';
        const tipoMensagem: TipoMensagem = novaSituacao === 'Contratado' ? 'CONTRATADO' : 'REPROVADO';

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
            tipo: tipoMensagem,
            variaveis: {
              titulo: vaga.titulo || '',
              status: 'Encerrada',
              etapa: vagaCandidato.etapa || '',
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
              cepCandidato: candidato.cepCandidato || '',
              ruaCandidato: candidato.ruaCandidato || '',
              numeroCandidato: candidato.numeroCandidato || '',
              bairroCandidato: candidato.bairroCandidato || '',
              cidadeCandidato: candidato.cidadeCandidato || '',
              estadoCandidato: candidato.estadoCandidato || '',
              empresaCandidato: candidato.empresaCandidato || '',
              empresa2Candidato: candidato.empresa2Candidato || '',
              empresa3Candidato: candidato.empresa3Candidato || '',
            }
          });
        }
      }

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

    let whatsappStatus = {
      info: 'Disparo automático desativado. Nenhuma mensagem foi enviada.',
      mensagensAgendadas: 0
    };

    // NOVO: 3. Adicionar verificação antes de enviar as mensagens
    if (whatsAppConfig.disparoAutomatico && resultado.mensagensPreparadas.length > 0) {
      console.log(`Disparo automático ATIVADO. Enviando ${resultado.mensagensPreparadas.length} mensagens...`);
      
      // A chamada para enviar as mensagens agora fica dentro da condição
      enviarMensagensEmLote(resultado.mensagensPreparadas)
        .then(res => console.log('Resultado do envio em lote (background):', res))
        .catch(err => console.error('Erro no envio em lote (background):', err));

      whatsappStatus = {
        info: 'O processo de encerramento foi concluído e as notificações estão sendo enviadas.',
        mensagensAgendadas: resultado.mensagensPreparadas.length
      };
    } else if (!whatsAppConfig.disparoAutomatico) {
      console.log('Disparo automático DESATIVADO. As mensagens foram preparadas mas não serão enviadas.');
    } else {
       console.log('Nenhuma mensagem a ser enviada.');
       whatsappStatus.info = 'Nenhum candidato com telefone válido para notificar.'
    }

    return NextResponse.json({
      vaga: resultado.vaga,
      candidatosAtualizados: resultado.candidatos,
      whatsapp: whatsappStatus // Resposta dinâmica baseada na configuração
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