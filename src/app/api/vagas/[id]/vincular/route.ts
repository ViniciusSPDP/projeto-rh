// src/app/api/vagas/[id]/vincular/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth-guard';
import prisma from '@/lib/prisma';
import { getEtapasConfig } from '@/lib/etapasConfig';
import { enviarMensagemSimples } from '@/lib/whatsapp-service';
import type { EtapasConfig } from '@/types/configuracoes';
import { Prisma } from '@prisma/client';

// --- FUNÇÃO AUXILIAR PARA FORMATAR DATAS ---
const formatDate = (date: Date | null | undefined): string => {
  if (!date) return '';
  const d = new Date(date);
  const dia = String(d.getUTCDate()).padStart(2, '0');
  const mes = String(d.getUTCMonth() + 1).padStart(2, '0');
  const ano = d.getUTCFullYear();
  return `${dia}/${mes}/${ano}`;
};

// 2. DEFINIÇÃO DO TIPO USANDO satisfies (mais limpa)
type AssociacaoCompleta = Prisma.VagaCandidatoGetPayload<{
  include: { candidato: true, vaga: true }
}>;

// --- FUNÇÃO DE ENVIO EM BACKGROUND ---
async function enviarNotificacoesEmBackground(associacoes: AssociacaoCompleta[], config: EtapasConfig) {
  console.log('BACKGROUND: Iniciando processo de envio de notificações.');
  const delay = config.delayEntreEnvios || 2000;

  for (const [index, associacao] of associacoes.entries()) {
    const candidato = associacao.candidato;
    const vaga = associacao.vaga;
    const etapaAtual = associacao.etapa;
    const situacaoCandidato = 'Em processo';
    const templateParaUsar = 'Em recrutamento';

    if (
      config.disparoPorEtapaAtivado &&
      candidato?.telefoneCandidato &&
      config.templatesPorEtapa[templateParaUsar]?.ativo
    ) {
      const templateMensagem = config.templatesPorEtapa[templateParaUsar].mensagem;
      
      const mensagemPersonalizada = templateMensagem
        .replace(/{{titulo}}/g, vaga.titulo || '')
        .replace(/{{status}}/g, vaga.status || '')
        .replace(/{{etapa}}/g, etapaAtual || '')
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
    
        
      try {
        await enviarMensagemSimples(candidato.telefoneCandidato, mensagemPersonalizada);
        console.log(`BACKGROUND: Notificação enviada para ${candidato.nomeCandidato}`);
      } catch (err) {
        console.error(`BACKGROUND: Falha no envio para ${candidato.nomeCandidato}:`, err);
      }
    }

    if (index < associacoes.length - 1) {
      console.log(`BACKGROUND: Pausando por ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  console.log('BACKGROUND: Processo de envio de notificações finalizado.');
}

// --- API PRINCIPAL (POST) ---
interface Context { params: { id: string; } }
interface RequestBody { candidatos: number[]; }

export async function POST(req: NextRequest, context: Context) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  try {
    const vagaId = Number(context.params.id);
    const { candidatos }: RequestBody = await req.json();

    if (isNaN(vagaId) || !Array.isArray(candidatos) || candidatos.length === 0) {
      return NextResponse.json({ error: 'Dados inválidos fornecidos.' }, { status: 400 });
    }

    const etapaParaSalvarNaVaga = 'Em recrutamento';
    const situacaoParaSalvarNoCandidato = 'Em processo';

    const associacoesCriadas: AssociacaoCompleta[] = await prisma.$transaction(async (tx) => {
      const resultados = [];
      for (const candidatoId of candidatos) {
        const novaAssociacao = await tx.vagaCandidato.create({
          data: { vagaId, candidatoId, etapa: etapaParaSalvarNaVaga },
          include: { candidato: true, vaga: true }
        });
        
        await tx.candidatos.update({
          where: { idCandidato: candidatoId },
          data: { situacaoCandidato: situacaoParaSalvarNoCandidato },
        });
        resultados.push(novaAssociacao);
      }
      return resultados;
    });

    getEtapasConfig().then(config => {
      enviarNotificacoesEmBackground(associacoesCriadas, config);
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Vinculação concluída. Notificações estão sendo enviadas em segundo plano.' 
    });

  } catch (error) {
    console.error("Erro ao vincular candidatos à vaga:", error);
    return NextResponse.json({ error: 'Erro interno do servidor ao vincular candidatos.' }, { status: 500 });
  }
}