import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const vagaId = Number(searchParams.get('vagaId'))
    const page = Number(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''
    const take = 10
    const skip = (page - 1) * take

    if (isNaN(vagaId)) {
      return NextResponse.json({ error: 'ID da vaga inválido' }, { status: 400 })
    }

    // Primeiro, busca os IDs dos candidatos que JÁ estão na vaga para excluí-los da lista
    const candidatosNaVaga = await prisma.vagaCandidato.findMany({
      where: { vagaId: vagaId },
      select: { candidatoId: true },
    })
    const idsExcluidos = candidatosNaVaga.map((vc) => vc.candidatoId)

    // Condição de busca para o nome, email, etc.
    const searchCondition = search
      ? {
          OR: [
            { nomeCandidato: { contains: search, mode: 'insensitive' } },
            { emailCandidato: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}

    // Busca os candidatos no banco, aplicando filtros, paginação e exclusão
    const candidatosDoBanco = await prisma.candidatos.findMany({
      where: {
        idCandidato: {
          notIn: idsExcluidos,
        },
        ...searchCondition,
      },
      select: {
        idCandidato: true,
        nomeCandidato: true,
        emailCandidato: true, // Pega o email do banco
      },
      take: take,
      skip: skip,
      orderBy: {
        nomeCandidato: 'asc',
      },
    })

    // ===== A CORREÇÃO CRÍTICA ESTÁ AQUI =====
    // Mapeia o resultado para um formato seguro para JSON.
    const candidatosSeguros = candidatosDoBanco.map(c => ({
      // Converte BigInt para Number. É seguro para IDs que não são astronômicos.
      idCandidato: Number(c.idCandidato), 
      nomeCandidato: c.nomeCandidato,
      // Renomeia 'emailCandidato' para 'email' para corresponder ao que o cliente espera.
      email: c.emailCandidato, 
    }));

    return NextResponse.json(candidatosSeguros)

  } catch (error) {
    console.error("Erro na API de candidatos disponíveis:", error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
