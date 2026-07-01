import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

const requireSessionMock = vi.hoisted(() => vi.fn());
vi.mock('@/lib/auth-guard', () => ({ requireSession: requireSessionMock, requireAdmin: vi.fn() }));

import { HEAD } from './route';

beforeEach(() => requireSessionMock.mockReset());

describe('HEAD /api/curriculos/[filename]', () => {
  it('401 sem sessão (não é oráculo de existência de PII)', async () => {
    requireSessionMock.mockResolvedValue(null);
    const req = new Request('http://x/api/curriculos/curriculo-abc-123.pdf', { method: 'HEAD' }) as unknown as NextRequest;
    const res = await HEAD(req, { params: { filename: 'curriculo-abc-123.pdf' } });
    expect(res.status).toBe(401);
  });
});
