# CLAUDE.md

Guia para o Claude Code (e devs) trabalharem neste repositório.

## O que é

Sistema de RH/recrutamento (web). Candidatos se inscrevem em vagas (formulário público,
com upload de currículo em PDF); recrutadores autenticados gerenciam candidatos, vagas,
processo seletivo (kanban), observações e geração de imagens de divulgação.

Domínio de produção: `conexaorh.s4r41va.com`.

## Stack

- **Next.js 15.3.1** (App Router, React 19, TypeScript).
- **Prisma 6** + **PostgreSQL** (`prisma/schema.prisma`, client default `@prisma/client`).
- **NextAuth v4** (Credentials + JWT) — `src/lib/authOptions.ts`.
- **MinIO / S3** via `@aws-sdk/client-s3` v3 — `src/lib/minio.ts`. Armazena os **currículos (PDF)**.
- **Cloudinary** — imagens de template de divulgação (`/api/upload/image`, `ImageTemplate.backgroundImageUrl`).
- Tailwind, lucide-react.

## Comandos

```bash
npm run dev          # dev (turbopack)
npm run build        # build de produção
npm run start        # serve o build
npm run lint         # eslint
npx tsc --noEmit     # typecheck
npx prisma migrate dev      # aplicar/gerar migrations (dev)
npx prisma generate         # regenerar client
```

## Arquitetura de arquivos / storage (IMPORTANTE)

Onde cada arquivo vive — não confundir:

| Dado | Onde fica | Campo / rota |
|------|-----------|--------------|
| **Currículo (PDF)** | **MinIO (bucket privado `projeto-rh`)** | `Candidatos.curriculoUrl` guarda a **KEY** (ex.: `curriculos/<tel>-<hash>.pdf`) |
| **Foto do candidato** | **MinIO** (KEY `fotos/candidatos/<hash>.<ext>`), com fallback base64 | `Candidatos.fotoCandidato` |
| **Foto de perfil do usuário** | **MinIO** (KEY `fotos/usuarios/<hash>.<ext>`), com fallback base64 | `usuario.fotourl` |
| Imagem de template | **Cloudinary** (não MinIO) | `ImageTemplate.backgroundImageUrl` (URL completa) |
| Currículos legados | **disco local** `public/uploads/curriculos/` | servidos por `/api/curriculos/[filename]` |

> **Fotos:** novos uploads vão pro MinIO e guardam a KEY (`fotos/...`). Registros antigos podem
> ainda ter base64 — a exibição aceita os dois via `resolveFotoSrc` ([src/lib/foto.ts](src/lib/foto.ts)).
> Backfill: `node scripts/backfill-fotos-minio.js --dry-run`.

### Bucket MinIO é PRIVADO — acesso só autenticado

O bucket NÃO é público. Currículos são exibidos via **proxy autenticado**:

- **Upload:** `POST /api/candidaturas` faz `PutObjectCommand` e salva **só a KEY** em `curriculoUrl`.
  Nunca montar/salvar URL pública (`${endpoint}/${bucket}/${key}`).
- **Exibição/Download:** `GET /api/candidatos/[id]/curriculo` — valida sessão NextAuth
  (`getServerSession`), busca a key (`extractObjectKey`), faz `GetObjectCommand` e stream do PDF
  (`Content-Type: application/pdf`, `Cache-Control: private, no-store`). O frontend
  (`CurriculoViewer` via `DetalhesCandidatoComCurriculo`) aponta o `<iframe>`/download para essa rota.
- **`extractObjectKey(stored)`** (em `src/lib/minio.ts`) normaliza valores antigos (URL pública,
  com `:443`/`:9000`, malformada `https:/`) e novos (key crua). É o que mantém currículos antigos
  funcionando sem migração de dados obrigatória.
- **Fotos (candidato/usuário):** upload via `uploadBase64Image(input, 'fotos/...')` (guarda KEY);
  exibição via proxy autenticado **`/api/candidatos/[id]/foto`**, **`/api/usuarios/[id]/foto`** e
  **`/api/user/avatar`** (próprio). No frontend, sempre montar a `src` com
  `resolveFotoSrc(valor, proxyUrl)` — nunca usar `fotoCandidato`/`fotourl` direto no `<Image>`.
- **Middleware NÃO protege `/api`** (`src/middleware.ts` exclui `api`). Toda rota de API com dado
  sensível precisa validar sessão **internamente** com `getServerSession(authOptions)`.

⚠️ **Nunca** persistir presigned URL nem URL pública no banco — sempre só a KEY; gerar o acesso na
hora (proxy). Adicionar um `remotePattern` do MinIO no `next.config.ts` reabriria a porta — não fazer.

## Convenções

- `idCandidato` é **BigInt** no Prisma; serializar para string antes de passar a Client Components
  (`...candidato, idCandidato: candidato.idCandidato.toString()`).
- Route handlers Next 15: `params` é **Promise** — `const { id } = await params`.
- Validar `id` com `/^\d+$/` antes de `BigInt(id)` (evita exceção).
- Scripts utilitários: Node puro em `scripts/*.js` (não há `tsx`/`ts-node`). Ex.:
  `node scripts/backfill-curriculo-key.js --dry-run`.

## Variáveis de ambiente (MinIO)

`MINIO_ENDPOINT`, `MINIO_USE_SSL`, `MINIO_PORT` (opcional), `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`,
`MINIO_BUCKET_NAME` (prod: `projeto-rh`). **Nunca** expor como `NEXT_PUBLIC_*`. Recomendado manter as
chaves em secrets (não versionar no `.env`).

## Tornar o bucket privado sem perder currículos (rollout seguro)

Nada no código apaga/move objetos do MinIO (upload = PutObject; proxy = GetObject read-only;
backfill = só reescreve string no banco). Ordem segura:

1. **Deploy do código primeiro** (com o bucket ainda público). Currículos continuam funcionando:
   o proxy serve tanto keys novas quanto URLs antigas (`extractObjectKey`).
2. Verificar exibição/download logado e 401 deslogado.
3. **Só então** tornar o bucket privado no MinIO: `mc anonymous set none <alias>/projeto-rh`.
4. Reverificar; confirmar que a URL pública crua passa a dar **403**.
5. (Opcional) `node scripts/backfill-curriculo-key.js --dry-run` e depois sem flag, para normalizar o
   banco. Fazer **backup do banco** antes. Reversível/idempotente.

Detalhes completos: `03-Projetos/Projeto-RH/` no "Segundo Cérebro" (Obsidian).
