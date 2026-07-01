import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

const requireAdminMock = vi.hoisted(() => vi.fn());
vi.mock('@/lib/auth-guard', () => ({ requireAdmin: requireAdminMock, requireSession: vi.fn() }));

const createMock = vi.hoisted(() => vi.fn());
const findUniqueMock = vi.hoisted(() => vi.fn());
vi.mock('@/lib/prisma', () => ({
  default: { usuario: { create: createMock, findUnique: findUniqueMock } },
}));
vi.mock('@/lib/minio', () => ({ uploadBase64Image: vi.fn(async () => null) }));

import { POST } from './route';

function post(body: unknown) {
  return new Request('http://x/api/usuarios', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  }) as unknown as NextRequest;
}

beforeEach(() => {
  requireAdminMock.mockReset();
  createMock.mockReset();
  findUniqueMock.mockReset();
});

describe('POST /api/usuarios (RBAC)', () => {
  it('403 para usuário não-admin (não cria)', async () => {
    requireAdminMock.mockResolvedValue(null);
    const res = await POST(post({ nome: 'a', email: 'a@a', senha: '123456' }));
    expect(res.status).toBe(403);
    expect(createMock).not.toHaveBeenCalled();
  });

  it('cria usuário e não devolve senhahash quando ADMIN', async () => {
    requireAdminMock.mockResolvedValue({ user: { id: '1', role: 'ADMIN' } });
    findUniqueMock.mockResolvedValue(null);
    createMock.mockResolvedValue({ id: 2, nome: 'a', email: 'a@a', senhahash: 'h', role: 'USER' });
    const res = await POST(post({ nome: 'a', email: 'a@a', senha: '123456' }));
    expect(res.status).toBe(201);
    expect(createMock).toHaveBeenCalled();
    const json = await res.json();
    expect(json).not.toHaveProperty('senhahash');
  });
});
