import { describe, it, expect, vi, beforeEach } from 'vitest';

const createMock = vi.hoisted(() => vi.fn());
const vagaCreateMock = vi.hoisted(() => vi.fn());
vi.mock('@/lib/prisma', () => ({
  default: { candidatos: { create: createMock }, vagaCandidato: { create: vagaCreateMock } },
}));
vi.mock('@/lib/minio', () => ({ uploadBase64Image: vi.fn(async () => null) }));

import { POST } from './route';
import { __resetRateLimitStore } from '@/lib/rate-limit';

function post(body: unknown, ip = '1.1.1.1') {
  return new Request('http://x/api/candidatos/publico', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
  });
}

beforeEach(() => {
  __resetRateLimitStore();
  createMock.mockReset();
  createMock.mockResolvedValue({ idCandidato: 10n });
  vagaCreateMock.mockReset();
});

describe('POST /api/candidatos/publico', () => {
  it('400 sem consentimento (não cria)', async () => {
    const res = await POST(post({ nomeCandidato: 'x' }));
    expect(res.status).toBe(400);
    expect(createMock).not.toHaveBeenCalled();
  });

  it('faz strip de campos fora da whitelist e de workflow antes do Prisma', async () => {
    const res = await POST(post({
      consentimento: true,
      nomeCandidato: 'Ana',
      idCandidato: 999,
      curriculoUrl: 'hack',
      situacaoCandidato: 'Aprovado', // campo de workflow — não pode vir do candidato
      vagaId: 7,
    }));
    expect(res.status).toBe(200);
    const data = createMock.mock.calls[0][0].data;
    expect(data.nomeCandidato).toBe('Ana');
    expect(data).not.toHaveProperty('idCandidato');
    expect(data).not.toHaveProperty('curriculoUrl');
    expect(data).not.toHaveProperty('situacaoCandidato');
    // vagaId (do body cru) ainda gera o vínculo com a vaga
    expect(vagaCreateMock).toHaveBeenCalled();
    expect(vagaCreateMock.mock.calls[0][0].data.vagaId).toBe(7);
  });

  it('rate limit: bloqueia o 6º POST no mesmo IP', async () => {
    const body = { consentimento: true, nomeCandidato: 'A' };
    for (let i = 0; i < 5; i++) {
      const ok = await POST(post(body, '2.2.2.2'));
      expect(ok.status).toBe(200);
    }
    const blocked = await POST(post(body, '2.2.2.2'));
    expect(blocked.status).toBe(429);
  });
});
