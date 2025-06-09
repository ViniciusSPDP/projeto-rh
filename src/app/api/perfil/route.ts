// src/app/api/perfil/route.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

// GET: Busca os dados do perfil do usuário logado
export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await prisma.usuario.findUnique({
        where: { id: Number(session.user.id) },
        select: {
            nome: true,
            email: true,
            fotourl: true,
        }
    });

    if (!user) {
        return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(user);
}

// PATCH: Atualiza os dados do perfil do usuário logado
export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const body = await req.json();
    const { nome, email, fotourl, senha_atual, nova_senha } = body;

    const updateData: { nome?: string; email?: string; fotourl?: string | null; senhahash?: string } = {};

    // Atualização de dados básicos
    if (nome) updateData.nome = nome;
    if (email) updateData.email = email;
    // Permite remover a foto passando `null`
    if (fotourl !== undefined) updateData.fotourl = fotourl;

    // Lógica para alteração de senha
    if (senha_atual && nova_senha) {
        if (nova_senha.length < 6) {
            return NextResponse.json({ error: "A nova senha deve ter pelo menos 6 caracteres." }, { status: 400 });
        }

        const user = await prisma.usuario.findUnique({ where: { id: userId } });
        if (!user) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });

        const isPasswordCorrect = await bcrypt.compare(senha_atual, user.senhahash);
        if (!isPasswordCorrect) {
            return NextResponse.json({ error: "A senha atual está incorreta." }, { status: 403 });
        }

        updateData.senhahash = await bcrypt.hash(nova_senha, 10);
    }
    
    if (Object.keys(updateData).length === 0) {
        return NextResponse.json({ error: "Nenhum dado para atualizar." }, { status: 400 });
    }
    
    // Valida se o novo e-mail já está em uso por outro usuário
    if (email) {
        const existingUser = await prisma.usuario.findUnique({ where: { email } });
        if (existingUser && existingUser.id !== userId) {
            return NextResponse.json({ error: "Este e-mail já está em uso." }, { status: 409 });
        }
    }

    const updatedUser = await prisma.usuario.update({
        where: { id: userId },
        data: updateData,
    });

    return NextResponse.json({
        nome: updatedUser.nome,
        email: updatedUser.email,
        fotourl: updatedUser.fotourl,
    });
}
