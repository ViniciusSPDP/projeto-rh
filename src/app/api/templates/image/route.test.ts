import { describe, it, expect, vi, beforeEach } from 'vitest';

const requireSessionMock = vi.hoisted(() => vi.fn());
vi.mock('@/lib/auth-guard', () => ({ requireSession: requireSessionMock, requireAdmin: vi.fn() }));

const createMock = vi.hoisted(() => vi.fn());
vi.mock('@/lib/prisma', () => ({ default: { imageTemplate: { create: createMock } } }));

// DNS mockado — só o caso Cloudinary "sucesso" resolve para IP público.
const lookupMock = vi.hoisted(() => vi.fn());
vi.mock('dns/promises', () => ({ lookup: lookupMock }));

import { POST } from './route';

function post(body: unknown) {
  return new Request('http://x/api/templates/image', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

beforeEach(() => {
  requireSessionMock.mockResolvedValue({ user: { id: '1', role: 'USER' } });
  createMock.mockReset();
  lookupMock.mockReset();
});

describe('POST /api/templates/image (anti-SSRF na origem)', () => {
  it('rejeita backgroundImageUrl fora do Cloudinary (400) e não grava', async () => {
    const res = await POST(post({
      name: 't',
      backgroundImageUrl: 'http://169.254.169.254/latest/meta-data/',
      elements: [],
    }));
    expect(res.status).toBe(400);
    expect(createMock).not.toHaveBeenCalled();
  });

  it('aceita URL Cloudinary (host permitido + IP público) e cria', async () => {
    lookupMock.mockResolvedValue([{ address: '104.18.0.1', family: 4 }]);
    createMock.mockResolvedValue({ id: 'abc', name: 't' });
    const res = await POST(post({
      name: 't',
      backgroundImageUrl: 'https://res.cloudinary.com/demo/image/upload/x.png',
      elements: [{ id: '1', x: 0, y: 0, text: 'oi', fontSize: 20, fill: '#000' }],
    }));
    expect(res.status).toBe(201);
    expect(createMock).toHaveBeenCalled();
  });
});
