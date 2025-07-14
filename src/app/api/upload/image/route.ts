// src/app/api/upload/image/route.ts

import { NextResponse } from 'next/server';
import path from 'path';
import { writeFile, stat, mkdir } from 'fs/promises';

export async function POST(req: Request) {
    try {
        // 1. Usa o método nativo para pegar os dados do formulário
        const formData = await req.formData();

        // 2. Pega o arquivo enviado (o nome 'file' deve ser o mesmo usado no formulário do frontend)
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
        }

        // 3. Converte o arquivo para um Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // 4. Cria um nome de arquivo único
        const filename = `template-${Date.now()}${path.extname(file.name)}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');

        // 5. Garante que o diretório de upload exista
        try {
            await stat(uploadDir);
        } catch (error: unknown) { // 1. Use 'unknown' em vez de 'any'
            // 2. Adicione uma verificação para garantir que 'error' é um objeto com a propriedade 'code'
            if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
                // Se o diretório não existe, ele será criado.
                await mkdir(uploadDir, { recursive: true });
            } else {
                // Para qualquer outro tipo de erro, ele será logado e relançado.
                console.error('Erro ao verificar diretório:', error);
                throw error;
            }
        }

        // 6. Escreve o arquivo no disco
        await writeFile(path.join(uploadDir, filename), buffer);

        // 7. Retorna a URL pública do arquivo salvo
        const publicUrl = `/uploads/${filename}`;
        return NextResponse.json({ url: publicUrl }, { status: 201 });

    } catch (error) {
        console.error('Erro no upload da imagem:', error);
        return NextResponse.json({ error: 'Falha ao fazer upload da imagem.' }, { status: 500 });
    }
}