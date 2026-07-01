import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

const requireAdminMock = vi.hoisted(() => vi.fn());
vi.mock('@/lib/auth-guard', () => ({ requireAdmin: requireAdminMock, requireSession: vi.fn() }));

const findManyMock = vi.hoisted(() => vi.fn());
vi.mock('@/lib/prisma', () => ({
  default: {
    formularioAnalytics: { findMany: findManyMock },
    conversaoFunil: { findMany: vi.fn(async () => []) },
  },
}));

import { GET } from './route';

function get() {
  return new Request('http://x/api/analytics/export?formato=json&periodo=mes') as unknown as NextRequest;
}

beforeEach(() => {
  requireAdminMock.mockReset();
  findManyMock.mockReset();
});

describe('GET /api/analytics/export', () => {
  it('403 para não-admin (PII)', async () => {
    requireAdminMock.mockResolvedValue(null);
    const res = await GET(get());
    expect(res.status).toBe(403);
    expect(findManyMock).not.toHaveBeenCalled();
  });

  it('não vaza detalhes do erro para o cliente', async () => {
    requireAdminMock.mockResolvedValue({ user: { id: '1', role: 'ADMIN' } });
    findManyMock.mockRejectedValue(new Error('detalhe-interno-secreto'));
    const res = await GET(get());
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).not.toHaveProperty('details');
    expect(JSON.stringify(json)).not.toContain('detalhe-interno-secreto');
  });
});
