import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { rateLimit, getClientIp, __resetRateLimitStore } from './rate-limit';

beforeEach(() => {
  __resetRateLimitStore();
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe('rateLimit', () => {
  it('permite até o limite e bloqueia o seguinte', () => {
    const key = 'ip:1';
    expect(rateLimit(key, 3, 60_000).allowed).toBe(true); // 1
    expect(rateLimit(key, 3, 60_000).allowed).toBe(true); // 2
    const third = rateLimit(key, 3, 60_000); // 3
    expect(third.allowed).toBe(true);
    expect(third.remaining).toBe(0);
    expect(rateLimit(key, 3, 60_000).allowed).toBe(false); // 4 -> bloqueado
  });

  it('reseta a contagem após a janela', () => {
    const key = 'ip:2';
    rateLimit(key, 1, 60_000);
    expect(rateLimit(key, 1, 60_000).allowed).toBe(false);
    vi.advanceTimersByTime(60_001);
    expect(rateLimit(key, 1, 60_000).allowed).toBe(true);
  });

  it('chaves diferentes são independentes', () => {
    expect(rateLimit('a', 1, 60_000).allowed).toBe(true);
    expect(rateLimit('b', 1, 60_000).allowed).toBe(true);
  });
});

describe('getClientIp', () => {
  it('usa o primeiro IP do x-forwarded-for', () => {
    const req = new Request('http://x', { headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' } });
    expect(getClientIp(req)).toBe('1.2.3.4');
  });

  it('cai para x-real-ip e depois "unknown"', () => {
    expect(getClientIp(new Request('http://x', { headers: { 'x-real-ip': '9.9.9.9' } }))).toBe('9.9.9.9');
    expect(getClientIp(new Request('http://x'))).toBe('unknown');
  });
});
