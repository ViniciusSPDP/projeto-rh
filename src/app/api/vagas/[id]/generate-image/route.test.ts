import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const requireSessionMock = vi.hoisted(() => vi.fn());
vi.mock('@/lib/auth-guard', () => ({ requireSession: requireSessionMock, requireAdmin: vi.fn() }));

const vagaFindMock = vi.hoisted(() => vi.fn());
const templateFindMock = vi.hoisted(() => vi.fn());
vi.mock('@/lib/prisma', () => ({
  default: {
    vaga: { findUnique: vagaFindMock },
    imageTemplate: { findUnique: templateFindMock },
  },
}));

// safeFetch mockado — simula guard anti-SSRF barrando a URL do template.
const safeFetchMock = vi.hoisted(() => vi.fn());
vi.mock('@/lib/url-guard', () => ({ safeFetch: safeFetchMock, CLOUDINARY_HOSTS: ['res.cloudinary.com'] }));

import { GET } from './route';

beforeEach(() => {
  requireSessionMock.mockResolvedValue({ user: { id: '1', role: 'USER' } });
  vagaFindMock.mockResolvedValue({ idVaga: 1, titulo: 'Dev', descricao: null });
  templateFindMock.mockResolvedValue({
    id: 'abc',
    backgroundImageUrl: 'https://res.cloudinary.com/demo/x.png',
    elements: [],
  });
  safeFetchMock.mockReset();
});

describe('GET generate-image (anti-SSRF em tempo de fetch)', () => {
  it('retorna 400 quando o guard barra a URL de fundo', async () => {
    safeFetchMock.mockRejectedValue(new Error('Host não permitido'));
    const req = new NextRequest('http://x/api/vagas/1/generate-image?templateId=abc');
    const res = await GET(req, { params: { id: '1' } });
    expect(res.status).toBe(400);
  });
});
