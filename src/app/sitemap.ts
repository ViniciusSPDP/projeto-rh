import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // IMPORTANTE: Altere esta URL para o domínio real do seu site!
  const baseUrl = 'https://s4r41va.com';

  // 1. Adicionar as URLs estáticas/principais do seu site
  const staticRoutes = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const, // CORREÇÃO AQUI
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const, // CORREÇÃO AQUI
      priority: 0.5,
    },
  ];

  // 2. Buscar no banco de dados todas as vagas abertas para adicioná-las dinamicamente
  const vagasAbertas = await prisma.vaga.findMany({
    where: {
      status: 'Aberta',
    },
    select: {
      idVaga: true,
    },
  });

  const dynamicVagaRoutes = vagasAbertas.map((vaga) => ({
    url: `${baseUrl}/vagas/${vaga.idVaga}/formulario`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const, // CORREÇÃO AQUI
    priority: 0.8,
  }));

  // 3. Retorna a combinação das rotas estáticas e dinâmicas
  return [...staticRoutes, ...dynamicVagaRoutes];
}