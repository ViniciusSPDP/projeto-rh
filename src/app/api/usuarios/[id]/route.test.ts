import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

const requireAdminMock = vi.hoisted(() => vi.fn());
vi.mock('@/lib/auth-guard', () => ({ requireAdmin: requireAdminMock, requireSession: vi.fn() }));

const updateMock = vi.hoisted(() => vi.fn());
vi.mock('@/lib/prisma', () => ({ default: { usuario: { update: updateMock } } }));

import { PATCH } from './route';

function patch(body: unknown) {
  return new Request('http://x/api/usuarios/5', {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  }) as unknown as NextRequest;
}

beforeEach(() => {
  requireAdminMock.mockReset();
  updateMock.mockReset();
});

describe('PATCH /api/usuarios/[id] (RBAC — vetor de takeover)', () => {
  it('403 para não-admin: não permite resetar senha de terceiros', async () => {
    requireAdminMock.mockResolvedValue(null);
    const res = await PATCH(patch({ senha: 'novaSenha123' }), { params: { id: '5' } });
    expect(res.status).toBe(403);
    expect(updateMock).not.toHaveBeenCalled();
  });

  it('ADMIN consegue atualizar', async () => {
    requireAdminMock.mockResolvedValue({ user: { id: '1', role: 'ADMIN' } });
    updateMock.mockResolvedValue({ id: 5, nome: 'x', email: 'x@x', senhahash: 'h', role: 'USER' });
    const res = await PATCH(patch({ autorizado: true }), { params: { id: '5' } });
    expect(res.status).toBe(200);
    expect(updateMock).toHaveBeenCalled();
    const json = await res.json();
    expect(json).not.toHaveProperty('senhahash');
  });
});
