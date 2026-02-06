import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuração para servir arquivos estáticos
  async rewrites() {
    return [
      {
        source: '/uploads/curriculos/:path*',
        destination: '/api/curriculos/:path*',
      },
    ];
  },

  // Configuração para headers de segurança dos PDFs
  async headers() {
    return [
      {
        source: '/uploads/curriculos/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/pdf',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/api/curriculos/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/pdf',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },

  // CORRIGIDO: serverComponentsExternalPackages movido para serverExternalPackages
  serverExternalPackages: ['prisma'],

  // Configuração de imagens otimizada para VPS e MinIO
  images: {
    domains: ['localhost', '192.168.1.42'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.42',
        port: '3000',
      },
      {
        protocol: 'https',
        hostname: 'conexaorh.s4r41va.com', // Substitua pelo seu domínio de produção
      },
      // --- CONFIGURAÇÃO DO MINIO (ADICIONADA) ---
      {
        protocol: 'https',         // Use 'https' se estiver configurado com SSL
        hostname: 'dados-minio.v1dvzt.easypanel.host',    // Ou o IP/Domínio onde o MinIO está rodando
        port: '9000',             // Porta padrão do MinIO
        pathname: '/projeto-rh/**', // Nome do bucket definido no .env
      },
    ],
    unoptimized: true, // Para VPS simples
  },

  // Otimizações de produção
  poweredByHeader: false,
  compress: true,

  // Configuração de bundle para otimizar o Prisma + canvas no client
  webpack: (config, { dev, isServer }) => {
    // canvas: evitar empacotamento no client
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push('canvas');
    }

    // Otimizações apenas para produção
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          prisma: {
            name: 'prisma',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](@prisma|prisma)[\\/]/,
            priority: 40,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },

  // Configuração de TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },

  // Configuração do ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;