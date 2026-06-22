// ARQUIVO: A sua rota que atualiza a etapa do candidato (ex: /api/vagas/[id]/candidatos/[vagaCandidatoId]/route.ts)

import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';
import { getEtapasConfig } from '@/lib/etapasConfig';
import { enviarMensagemSimples } from '@/lib/whatsapp-service';

// --- 1. FUNÇÃO AUXILIAR PARA FORMATAR DATAS ---
const formatDate = (date: Date | null | undefined): string => {
  if (!date) return '';
  // Garante que a data seja tratada como UTC para evitar problemas de fuso horário
  const d = new Date(date);
  const dia = String(d.getUTCDate()).padStart(2, '0');
  const mes = String(d.getUTCMonth() + 1).padStart(2, '0'); // Meses são de 0 a 11
  const ano = d.getUTCFullYear();
  return `${dia}/${mes}/${ano}`;
};
  
// Definindo a interface para o contexto da rota
interface Context {
  params: {
    id: string; 
    vagaCandidatoId: string;
  }
}

export async function PATCH(
  req: NextRequest,
  context: Context
) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const { vagaCandidatoId } = context.params;
  const { etapa: novaEtapa } = await req.json();

  const vagaCandidatoIdNum = Number(vagaCandidatoId);

  if (!novaEtapa || isNaN(vagaCandidatoIdNum)) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  try {
    const vagaCandidatoAtualizado = await prisma.vagaCandidato.update({
      where: { id: vagaCandidatoIdNum },
      data: { etapa: novaEtapa },
      include: {
        candidato: true,
        vaga: true,
      }
    });

    // --- INÍCIO DA LÓGICA DE NOTIFICAÇÃO ---
    const config = await getEtapasConfig();
    const candidato = vagaCandidatoAtualizado.candidato;
    const vaga = vagaCandidatoAtualizado.vaga;
    const situacaoCandidato = novaEtapa; // A nova situação é a nova etapa

    if (
      config.disparoPorEtapaAtivado &&
      candidato?.telefoneCandidato &&
      config.templatesPorEtapa[novaEtapa]?.ativo
    ) {
      
      const templateMensagem = config.templatesPorEtapa[novaEtapa].mensagem;
      
      // --- 2. BLOCO DE PERSONALIZAÇÃO ATUALIZADO ---
      const mensagemPersonalizada = templateMensagem
        .replace(/{{titulo}}/g, vaga.titulo || '')
        .replace(/{{status}}/g, vaga.status || '')
        .replace(/{{etapa}}/g, novaEtapa || '')
        .replace(/{{nomeCandidato}}/g, candidato.nomeCandidato || '')
        .replace(/{{emailCandidato}}/g, candidato.emailCandidato || '')
        .replace(/{{cpfCandidato}}/g, candidato.cpfCandidato || '')
        .replace(/{{telefoneCandidato}}/g, candidato.telefoneCandidato || '')
        .replace(/{{datanascimentoCandidato}}/g, formatDate(candidato.datanascimentoCandidato))
        .replace(/{{rgCandidato}}/g, candidato.rgCandidato || '')
        .replace(/{{sexoCandidato}}/g, candidato.sexoCandidato || '')
        .replace(/{{estadocivilCandidato}}/g, candidato.estadocivilCandidato || '')
        .replace(/{{escolaridadeCandidato}}/g, candidato.escolaridadeCandidato || '')
        .replace(/{{situacaoCandidato}}/g, situacaoCandidato)
        .replace(/{{cepCandidato}}/g, candidato.cepCandidato || '')
        .replace(/{{ruaCandidato}}/g, candidato.ruaCandidato || '')
        .replace(/{{numeroCandidato}}/g, candidato.numeroCandidato || '')
        .replace(/{{bairroCandidato}}/g, candidato.bairroCandidato || '')
        .replace(/{{cidadeCandidato}}/g, candidato.cidadeCandidato || '')
        .replace(/{{estadoCandidato}}/g, candidato.estadoCandidato || '')
        .replace(/{{empresaCandidato}}/g, candidato.empresaCandidato || '')
        .replace(/{{empresa2Candidato}}/g, candidato.empresa2Candidato || '')
        .replace(/{{empresa3Candidato}}/g, candidato.empresa3Candidato || '');
      
      enviarMensagemSimples(candidato.telefoneCandidato, mensagemPersonalizada)
        .then(() => console.log(`Notificação de etapa enviada para ${candidato.nomeCandidato} (${candidato.telefoneCandidato})`))
        .catch(err => console.error("Falha no envio da notificação de etapa via WhatsApp:", err));
    }

    // --- FIM DA LÓGICA DE NOTIFICAÇÃO ---

    return NextResponse.json({
      ...vagaCandidatoAtualizado,
      vagaId: Number(vagaCandidatoAtualizado.vagaId),
      candidatoId: Number(vagaCandidatoAtualizado.candidatoId),
    });

  } catch (error) {
    console.error("Erro ao atualizar etapa do candidato:", error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}