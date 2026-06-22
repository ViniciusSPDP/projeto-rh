# Dockerfile de produção — Next.js 15 + Prisma + canvas/sharp (módulos nativos)
# Substitui o build por buildpacks Heroku no Easypanel.
# syntax=docker/dockerfile:1

# ---- Base: Debian slim com libs de runtime do node-canvas + openssl p/ Prisma ----
FROM node:20-bookworm-slim AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
      libcairo2 libpango-1.0-0 libjpeg62-turbo libgif7 librsvg2-2 \
      openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# ---- deps: dependências completas (inclui devDeps) para o build ----
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# ---- build: gera o Prisma Client e builda o Next ----
FROM deps AS build
COPY . .
# DATABASE_URL dummy só para o build (o PrismaClient é instanciado no import; não conecta).
# As env reais de produção são injetadas pelo Easypanel em runtime.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build?schema=public"
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate \
    && node scripts/setup-directories.js \
    && npm run build

# ---- prod-deps: só dependências de produção + engine do Prisma ----
FROM base AS prod-deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev && npx prisma generate

# ---- runner: imagem final ----
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.mjs ./next.config.mjs
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/scripts ./scripts

EXPOSE 3000
# Bind explícito em 0.0.0.0 para o port-mapping do Docker/Easypanel alcançar o app
CMD ["node", "node_modules/next/dist/bin/next", "start", "-H", "0.0.0.0", "-p", "3000"]
