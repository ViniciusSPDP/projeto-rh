// CSP pragmático (enforce): script-src/style-src ficam permissivos ('unsafe-inline') para
// não quebrar o hydration do Next nem o GTM/GA; as proteções fortes contra clickjacking/
// plugin/base-hijack vêm de frame-ancestors 'none', object-src 'none' e base-uri 'self'.
// Hosts liberados batem com o que o app realmente usa: Cloudinary (imagens de template),
// viacep (busca de CEP) e Google Tag Manager / Analytics (layout.tsx).
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://viacep.com.br https://res.cloudinary.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com",
  "frame-src 'self' https://www.googletagmanager.com",
  "worker-src 'self' blob:",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'no-referrer' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Defesa da superfície RSC / Server Actions (React2Shell): só aceita ações
  // originadas dos domínios reais do app.
  experimental: {
    serverActions: {
      allowedOrigins: ['conexaorh.s4r41va.com', 'rh.conexaodistribuidora.com.br'],
    },
  },

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
      // Headers de segurança globais (CSP + hardening) em todas as rotas.
      {
        source: '/:path*',
        headers: securityHeaders,
      },
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
      // O bucket MinIO é PRIVADO: os arquivos não são mais carregados por URL pública
      // direta (eram servidos via <Image>/iframe). O currículo agora passa pelo proxy
      // autenticado /api/candidatos/[id]/curriculo. Por isso não há remotePattern do MinIO.
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
