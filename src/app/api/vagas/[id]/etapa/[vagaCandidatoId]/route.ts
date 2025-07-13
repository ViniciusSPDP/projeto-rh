// ARQUIVO: A sua rota que atualiza a etapa do candidato (ex: /api/vagas/[id]/candidatos/[vagaCandidatoId]/route.ts)

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getEtapasConfig } from '@/lib/etapasConfig'; // 1. IMPORTAÇÃO ADICIONAL
import { enviarMensagemSimples } from '@/lib/whatsapp-service'; // 1. IMPORTAÇÃO ADICIONAL (ver nota no final)
  
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
  const { vagaCandidatoId } = context.params;
  const { etapa: novaEtapa } = await req.json(); // Renomeado para clareza

  const vagaCandidatoIdNum = Number(vagaCandidatoId);

  if (!novaEtapa || isNaN(vagaCandidatoIdNum)) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  try {
    // Ação principal: Atualiza a etapa do candidato no banco de dados
    const vagaCandidatoAtualizado = await prisma.vagaCandidato.update({
      where: { id: vagaCandidatoIdNum },
      data: { etapa: novaEtapa },
      // 2. MODIFICAÇÃO NO PRISMA: Incluímos dados do candidato e da vaga para usar na mensagem
      include: {
        candidato: true, // Traz todos os dados do candidato relacionado
        vaga: true,      // Traz todos os dados da vaga relacionada
      }
    });

    // --- INÍCIO DA LÓGICA DE NOTIFICAÇÃO AUTOMÁTICA ---

    // 3. Busca as configurações de notificação que você criou na nova tela
    const config = await getEtapasConfig();
    const candidato = vagaCandidatoAtualizado.candidato;

    // 4. VERIFICAÇÃO TRIPLA: Só continua se todas as condições forem verdadeiras
    if (
      config.disparoPorEtapaAtivado &&                  // A. O recurso geral de "Disparo por Etapa" está ATIVO?
      candidato?.telefoneCandidato &&                   // B. O candidato possui um número de telefone cadastrado?
      config.templatesPorEtapa[novaEtapa]?.ativo        // C. O template para ESTA etapa específica está ATIVO?
    ) {
      
      // Se passou na verificação, busca a mensagem do template
      const templateMensagem = config.templatesPorEtapa[novaEtapa].mensagem;
      
      // 5. PERSONALIZAÇÃO: Substitui as variáveis na mensagem pelos dados reais
      const mensagemPersonalizada = templateMensagem
        .replace(/{nomeCandidato}/g, candidato.nomeCandidato || 'Candidato(a)')
        .replace(/{tituloVaga}/g, vagaCandidatoAtualizado.vaga.titulo || 'Vaga');
        // Você pode adicionar mais variáveis aqui (ex: .replace(/{nomeEmpresa}/g, ...))
      
      // 6. DISPARO: Envia a mensagem em segundo plano para não atrasar a resposta da API
      enviarMensagemSimples(candidato.telefoneCandidato, mensagemPersonalizada)
        .then(() => console.log(`Notificação de etapa enviada para ${candidato.nomeCandidato} (${candidato.telefoneCandidato})`))
        .catch(err => console.error("Falha no envio da notificação de etapa via WhatsApp:", err));
    }

    // --- FIM DA LÓGICA DE NOTIFICAÇÃO ---

    // A resposta para o frontend continua a mesma, retornando os dados atualizados
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