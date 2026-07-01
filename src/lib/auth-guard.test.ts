import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock do next-auth e do authOptions (evita puxar Prisma/adapter reais).
const getServerSessionMock = vi.hoisted(() => vi.fn());
vi.mock('next-auth', () => ({ getServerSession: getServerSessionMock }));
vi.mock('@/lib/authOptions', () => ({ authOptions: {} }));

import { requireSession, requireAdmin } from './auth-guard';

beforeEach(() => getServerSessionMock.mockReset());

describe('requireSession', () => {
  it('retorna null sem sessão', async () => {
    getServerSessionMock.mockResolvedValue(null);
    expect(await requireSession()).toBeNull();
  });

  it('retorna a sessão quando há user.id', async () => {
    const s = { user: { id: '1', role: 'USER' } };
    getServerSessionMock.mockResolvedValue(s);
    expect(await requireSession()).toBe(s);
  });
});

describe('requireAdmin', () => {
  it('null quando não logado', async () => {
    getServerSessionMock.mockResolvedValue(null);
    expect(await requireAdmin()).toBeNull();
  });

  it('null para usuário logado não-admin', async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: '1', role: 'USER' } });
    expect(await requireAdmin()).toBeNull();
  });

  it('retorna a sessão para ADMIN', async () => {
    const s = { user: { id: '1', role: 'ADMIN' } };
    getServerSessionMock.mockResolvedValue(s);
    expect(await requireAdmin()).toBe(s);
  });
});
