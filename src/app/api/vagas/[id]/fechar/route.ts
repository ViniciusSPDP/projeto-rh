// app/api/vagas/[id]/encerrar/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enviarMensagensEmLote } from '@/lib/whatsapp-service';

interface Context {
  params: {
    id: string;
  };
}

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
        select: { titulo: true }
      });

      if (!vaga) {
        throw new Error('Vaga não encontrada');
      }

      // Buscar candidatos com seus dados de contato
      const candidatosDaVaga = await tx.vagaCandidato.findMany({
        where: { vagaId: vagaId },
        include: {
          candidato: {
            select: {
              nomeCandidato: true,
              telefoneCandidato: true,
              emailCandidato: true
            }
          }
        }
      });

      // Preparar mensagens para envio
      const mensagensParaEnviar = [];

      // Atualizar situação dos candidatos
      for (const vagaCandidato of candidatosDaVaga) {
        const novaSituacao = vagaCandidato.etapa === 'Contratado' ? 'Contratado' : 'Reprovado';

        await tx.candidatos.update({ 
          where: {
            idCandidato: vagaCandidato.candidatoId,
          },
          data: {
            situacaoCandidato: novaSituacao,
          },
        });

        // Preparar mensagem se o candidato tiver telefone
        if (vagaCandidato.candidato?.telefoneCandidato && vagaCandidato.candidato?.nomeCandidato) {
          mensagensParaEnviar.push({
            numero: vagaCandidato.candidato.telefoneCandidato,
            nome: vagaCandidato.candidato.nomeCandidato,
            vaga: vaga.titulo,
            tipo: novaSituacao === 'Contratado' ? 'CONTRATADO' : 'REPROVADO' as const
          });
        }
      }

      // Atualizar status da vaga
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

    // Enviar mensagens via WhatsApp (fora da transação para não bloquear)
    let resultadoEnvio = null;
    
    console.log('Mensagens preparadas para envio:', resultado.mensagensPreparadas)
    
    if (resultado.mensagensPreparadas.length > 0) {
      console.log(`Iniciando envio de ${resultado.mensagensPreparadas.length} mensagens...`)
      
      // Enviar mensagens em background
      enviarMensagensEmLote(resultado.mensagensPreparadas)
        .then(res => {
          console.log('Resultado do envio de mensagens:', res);
        })
        .catch(err => {
          console.error('Erro ao enviar mensagens:', err);
        });
      
      resultadoEnvio = {
        mensagensAgendadas: resultado.mensagensPreparadas.length,
        info: 'As mensagens estão sendo enviadas em segundo plano'
      };
    } else {
      console.log('Nenhuma mensagem para enviar - verifique se os candidatos têm telefone cadastrado')
    }

    return NextResponse.json({
      vaga: resultado.vaga,
      candidatosAtualizados: resultado.candidatos,
      whatsapp: resultadoEnvio
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