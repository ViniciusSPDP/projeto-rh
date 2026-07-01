import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

const sendMock = vi.hoisted(() => vi.fn(async () => ({})));
vi.mock('@/lib/minio', () => ({
  s3Client: { send: sendMock },
  bucketName: 'projeto-rh',
  ensureBucketExists: vi.fn(async () => {}),
}));
vi.mock('@aws-sdk/client-s3', () => ({ PutObjectCommand: class { constructor(public input: unknown) {} } }));

const createMock = vi.hoisted(() => vi.fn());
vi.mock('@/lib/prisma', () => ({ default: { candidatos: { create: createMock } } }));

import { POST } from './route';
import { __resetRateLimitStore } from '@/lib/rate-limit';

function makeReq(fileBytes: string, ip = '3.3.3.3', type = 'application/pdf', name = 'cv.pdf') {
  const fd = new FormData();
  fd.append('nome', 'Ana');
  fd.append('email', 'ana@x.com');
  fd.append('telefone', '11999999999');
  fd.append('cargo', 'Dev');
  fd.append('consentimento', 'true');
  fd.append('curriculo', new File([Buffer.from(fileBytes)], name, { type }));
  return new Request('http://x/api/candidaturas', {
    method: 'POST',
    body: fd,
    headers: { 'x-forwarded-for': ip },
  }) as unknown as NextRequest;
}

beforeEach(() => {
  __resetRateLimitStore();
  sendMock.mockClear();
  createMock.mockReset();
  createMock.mockResolvedValue({ idCandidato: 1n });
});

describe('POST /api/candidaturas', () => {
  it('rejeita arquivo que não começa com %PDF- (magic byte), mesmo com mime pdf', async () => {
    const res = await POST(makeReq('PK isto e um zip'));
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
    expect(createMock).not.toHaveBeenCalled();
  });

  it('aceita PDF válido e sobe pro MinIO', async () => {
    const res = await POST(makeReq('%PDF-1.7\n%conteudo'));
    expect(res.status).toBe(201);
    expect(sendMock).toHaveBeenCalled();
    expect(createMock).toHaveBeenCalled();
  });

  it('rate limit: bloqueia o 6º upload no mesmo IP', async () => {
    for (let i = 0; i < 5; i++) {
      const ok = await POST(makeReq('%PDF-1.7\n%c', '4.4.4.4'));
      expect(ok.status).toBe(201);
    }
    const blocked = await POST(makeReq('%PDF-1.7\n%c', '4.4.4.4'));
    expect(blocked.status).toBe(429);
  });
});
