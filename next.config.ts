import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ADICIONE A CONFIGURAÇÃO WEBPACK AQUI DENTRO
  webpack: (config, { isServer }) => {
    // A biblioteca konva-node usa 'canvas', que é uma dependência de servidor.
    // Esta configuração diz ao webpack para não tentar empacotá-la no código do cliente.
    if (!isServer) {
      config.externals.push('canvas');
    }
    return config;
  },
};

export default nextConfig;