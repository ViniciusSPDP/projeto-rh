import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

const requireAdminMock = vi.hoisted(() => vi.fn());
vi.mock('@/lib/auth-guard', () => ({ requireAdmin: requireAdminMock, requireSession: vi.fn() }));

import { GET as etapasGet } from './etapas/route';
import { POST as whatsappPost } from './whatsapp/route';

beforeEach(() => requireAdminMock.mockReset());

describe('configuracoes/* exigem ADMIN', () => {
  it('GET etapas -> 403 para não-admin', async () => {
    requireAdminMock.mockResolvedValue(null);
    const res = await etapasGet();
    expect(res.status).toBe(403);
  });

  it('POST whatsapp -> 403 para não-admin', async () => {
    requireAdminMock.mockResolvedValue(null);
    const req = new Request('http://x/api/configuracoes/whatsapp', {
      method: 'POST',
      body: JSON.stringify({ disparoAutomatico: true }),
      headers: { 'content-type': 'application/json' },
    }) as unknown as NextRequest;
    const res = await whatsappPost(req);
    expect(res.status).toBe(403);
  });
});
