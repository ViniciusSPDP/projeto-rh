import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Evita carregar o postcss.config.mjs (Tailwind v4) — os testes não usam CSS
  css: { postcss: {} },
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
