import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  // Evita carregar o postcss.config.mjs (Tailwind v4) — os testes não usam CSS
  css: { postcss: {} },
  // Resolve o alias '@/...' (mesmo do tsconfig) para importar rotas/libs nos testes.
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // Env que src/lib/minio.ts lê no import (não conecta em nada nos testes)
    env: {
      MINIO_BUCKET_NAME: 'projeto-rh',
      MINIO_ENDPOINT: 'dados-minio.v1dvzt.easypanel.host',
      MINIO_USE_SSL: 'true',
    },
  },
});
