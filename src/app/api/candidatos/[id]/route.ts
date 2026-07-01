import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth-guard';
import prisma from '@/lib/prisma'
import { uploadBase64Image } from '@/lib/minio'
import { candidatoUpdateSchema } from '@/lib/validation/candidato'

// Corrigido a tipagem do 'context'
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const id = Number(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    // Whitelist Zod (parcial): só campos conhecidos e enviados são atualizados
    // (anti mass-assignment). As datas já são coeridas; campo ausente não é tocado.
    const parsed = candidatoUpdateSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }
    const dados = parsed.data

    // Foto: só re-processa se veio no payload. O helper é idempotente para
    // KEY/URL já existente (foto inalterada mantém o valor).
    const fotoCandidato =
      dados.fotoCandidato !== undefined
        ? await uploadBase64Image(dados.fotoCandidato, 'fotos/candidatos')
        : undefined

    const candidato = await prisma.candidatos.update({
      where: { idCandidato: id },
      data: {
        ...dados,
        ...(fotoCandidato !== undefined ? { fotoCandidato } : {}),
      },
    })

    return NextResponse.json(
      { ...candidato, idCandidato: candidato.idCandidato.toString() },
      { status: 200 },
    )

  } catch (error) {
    console.error('Erro ao atualizar candidato:', error)
    return NextResponse.json(
      { error: 'Erro interno ao atualizar candidato' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireSession();
  if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const idStr = await Promise.resolve(params.id)
  const id = Number(idStr)
  
  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  try {
    // Para deletar o candidato de forma segura, precisamos usar uma Transaction
    // para excluir todas as dependências relacionadas primeiro, já que 
    // VagaCandidato não possui onDelete: Cascade por padrão no banco do usuário.
    await prisma.$transaction([
      // 1. Apaga os vínculos com as vagas
      prisma.vagaCandidato.deleteMany({
        where: { candidatoId: id },
      }),
      // 2. Apaga o histórico de observações (se existir)
      prisma.observacaoHistorico.deleteMany({
        where: { candidatoId: id },
      }),
      // 3. Finalmente apaga o candidato
      prisma.candidatos.delete({
        where: { idCandidato: id },
      }),
    ])

    return NextResponse.json({ success: true, message: 'Candidato excluído com sucesso' }, { status: 200 })

  } catch (error) {
    console.error('Erro ao excluir candidato:', error)
    return NextResponse.json(
      { error: 'Erro interno ao excluir candidato.' },
      { status: 500 }
    )
  }
}