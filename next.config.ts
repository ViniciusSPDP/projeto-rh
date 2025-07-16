import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração para resolver problemas do Konva no build
  webpack: (config, { isServer }) => {
    // Configurações específicas para o lado do cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        encoding: false,
        fs: false,
        path: false,
        os: false,
      };
    }

    // Ignora módulos problemáticos do Konva
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push({
        canvas: 'canvas',
        jsdom: 'jsdom',
        'canvas-prebuilt': 'canvas-prebuilt',
      });
    }

    // Configuração específica para Konva
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    return config;
  },

  // Configuração do Turbopack (estável no Next.js 15)
  turbopack: {
    resolveExtensions: [
      '.mdx',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.mjs',
      '.json',
    ],
  },

  // Configuração para imagens
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
    },
    ];
  },
};

export default nextConfig;