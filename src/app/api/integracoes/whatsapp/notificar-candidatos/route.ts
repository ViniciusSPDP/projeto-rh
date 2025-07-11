// app/api/integracoes/whatsapp/notificar-candidatos/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enviarMensagensEmLote, verificarConexaoWhatsApp } from '@/lib/whatsapp-service';

export async function POST(req: NextRequest) {
  try {
    const { vagaId, candidatoIds, tipo } = await req.json();

    // Validar entrada
    if (!vagaId || !tipo || !['CONTRATADO', 'REPROVADO', 'CUSTOM'].includes(tipo)) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    // Verificar se WhatsApp está conectado
    const conectado = await verificarConexaoWhatsApp();
    if (!conectado) {
      return NextResponse.json(
        { error: 'WhatsApp não está conectado. Por favor, conecte-se primeiro.' },
        { status: 503 }
      );
    }

    // Buscar dados da vaga
    const vaga = await prisma.vaga.findUnique({
      where: { idVaga: vagaId },
      select: { titulo: true }
    });

    if (!vaga) {
      return NextResponse.json(
        { error: 'Vaga não encontrada' },
        { status: 404 }
      );
    }

    // Buscar candidatos
    const whereClause = candidatoIds 
      ? { vagaId, candidatoId: { in: candidatoIds } }
      : { vagaId };

    const candidatos = await prisma.vagaCandidato.findMany({
      where: whereClause,
      include: {
        candidato: {
          select: {
            idCandidato: true,
            nomeCandidato: true,
            telefoneCandidato: true
          }
        }
      }
    });

    // Filtrar candidatos com telefone
    const mensagensParaEnviar = candidatos
      .filter(vc => vc.candidato?.telefoneCandidato && vc.candidato?.nomeCandidato)
      .map(vc => ({
        numero: vc.candidato!.telefoneCandidato!,
        nome: vc.candidato!.nomeCandidato!,
        vaga: vaga.titulo,
        tipo: tipo as 'CONTRATADO' | 'REPROVADO'
      }));

    if (mensagensParaEnviar.length === 0) {
      return NextResponse.json({
        sucesso: false,
        mensagem: 'Nenhum candidato com telefone válido encontrado'
      });
    }

    // Enviar mensagens
    const resultado = await enviarMensagensEmLote(mensagensParaEnviar);

    return NextResponse.json({
      sucesso: true,
      resultado,
      resumo: {
        total: mensagensParaEnviar.length,
        enviadas: resultado.sucesso,
        falhas: resultado.falha
      }
    });

  } catch (error) {
    console.error('Erro ao notificar candidatos:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar notificações' },
      { status: 500 }
    );
  }
}

// GET - Verificar status de envio
export async function GET(req: NextRequest) {
  try {
    const conectado = await verificarConexaoWhatsApp();
    
    return NextResponse.json({
      whatsappConectado: conectado,
      servicoDisponivel: conectado
    });
  } catch (error) {
    return NextResponse.json({
      whatsappConectado: false,
      servicoDisponivel: false,
      erro: 'Não foi possível verificar o status'
    });
  }
}