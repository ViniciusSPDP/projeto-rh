import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

const requireSessionMock = vi.hoisted(() => vi.fn());
vi.mock('@/lib/auth-guard', () => ({ requireSession: requireSessionMock, requireAdmin: vi.fn() }));

const updateMock = vi.hoisted(() => vi.fn());
vi.mock('@/lib/prisma', () => ({ default: { candidatos: { update: updateMock } } }));
vi.mock('@/lib/minio', () => ({ uploadBase64Image: vi.fn(async (v: unknown) => v ?? null) }));

import { PATCH } from './route';

function patch(body: unknown) {
  return new Request('http://x/api/candidatos/5', {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  }) as unknown as NextRequest;
}

beforeEach(() => {
  requireSessionMock.mockResolvedValue({ user: { id: '1', role: 'USER' } });
  updateMock.mockReset();
  updateMock.mockResolvedValue({ idCandidato: 5n, nomeCandidato: 'Ana' });
});

describe('PATCH /api/candidatos/[id] (whitelist)', () => {
  it('descarta campos maliciosos/desconhecidos antes do update', async () => {
    const res = await PATCH(
      patch({ nomeCandidato: 'Ana', idCandidato: 999, curriculoUrl: 'hack', foo: 'bar' }),
      { params: { id: '5' } },
    );
    expect(res.status).toBe(200);
    const data = updateMock.mock.calls[0][0].data;
    expect(data.nomeCandidato).toBe('Ana');
    expect(data).not.toHaveProperty('idCandidato');
    expect(data).not.toHaveProperty('curriculoUrl');
    expect(data).not.toHaveProperty('foo');
  });

  it('não inclui campos não enviados (update parcial não zera nada)', async () => {
    await PATCH(patch({ emailCandidato: 'a@a.com' }), { params: { id: '5' } });
    const data = updateMock.mock.calls[0][0].data;
    expect(Object.keys(data)).toEqual(['emailCandidato']);
  });
});
