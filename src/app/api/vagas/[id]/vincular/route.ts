// src/app/api/vagas/[id]/vincular/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getEtapasConfig } from '@/lib/etapasConfig';
import { enviarMensagemSimples } from '@/lib/whatsapp-service';

// --- FUNÇÃO NOVA: LÓGICA DE ENVIO EM SEGUNDO PLANO ---
// Esta função será chamada para rodar de forma independente, sem travar a API.
async function enviarNotificacoesEmBackground(associacoes: any[], config: any) {
  console.log('BACKGROUND: Iniciando processo de envio de notificações.');
  
  // Lendo o valor do delay da configuração
  const delay = config.delayEntreEnvios || 2000;

  for (const [index, associacao] of associacoes.entries()) {
    const candidato = associacao.candidato;
    const templateParaUsar = 'Em recrutamento';

    // A mesma verificação tripla de antes
    if (
      config.disparoPorEtapaAtivado &&
      candidato?.telefoneCandidato &&
      config.templatesPorEtapa[templateParaUsar]?.ativo
    ) {
      const templateMensagem = config.templatesPorEtapa[templateParaUsar].mensagem;
      const mensagemPersonalizada = templateMensagem
        .replace(/{nomeCandidato}/g, candidato.nomeCandidato || 'Candidato(a)')
        .replace(/{tituloVaga}/g, associacao.vaga.titulo || 'Vaga');
      
      try {
        await enviarMensagemSimples(candidato.telefoneCandidato, mensagemPersonalizada);
        console.log(`BACKGROUND: Notificação enviada para ${candidato.nomeCandidato}`);
      } catch (err) {
        console.error(`BACKGROUND: Falha no envio para ${candidato.nomeCandidato}:`, err);
      }
    }

    // A pausa programada
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
  try {
    const vagaId = Number(context.params.id);
    const { candidatos }: RequestBody = await req.json();

    if (isNaN(vagaId) || !Array.isArray(candidatos) || candidatos.length === 0) {
      return NextResponse.json({ error: 'Dados inválidos fornecidos.' }, { status: 400 });
    }

    // --- LÓGICA DE NEGÓCIO CORRETA ---
    const etapaParaSalvarNaVaga = 'Em recrutamento';
    const situacaoParaSalvarNoCandidato = 'Em processo';

    // 1. SALVA TUDO NO BANCO E COLETA OS DADOS PARA O ENVIO
    const associacoesCriadas = await prisma.$transaction(async (tx) => {
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

    // 2. DISPARA O PROCESSO EM BACKGROUND
    // Chamamos a função sem 'await' para que ela rode em segundo plano.
    getEtapasConfig().then(config => {
      enviarNotificacoesEmBackground(associacoesCriadas, config);
    });

    // 3. RETORNA A RESPOSTA IMEDIATAMENTE PARA O USUÁRIO
    return NextResponse.json({ 
      success: true, 
      message: 'Vinculação concluída. Notificações estão sendo enviadas em segundo plano.' 
    });

  } catch (error) {
    console.error("Erro ao vincular candidatos à vaga:", error);
    return NextResponse.json({ error: 'Erro interno do servidor ao vincular candidatos.' }, { status: 500 });
  }
}