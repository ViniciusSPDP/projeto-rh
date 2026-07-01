import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock do DNS (hoisted) — nenhum teste resolve host de verdade.
const lookupMock = vi.hoisted(() => vi.fn());
vi.mock('dns/promises', () => ({ lookup: lookupMock }));

import {
  assertPublicHttpsUrl,
  safeFetch,
  isPrivateIPv4,
  isPrivateIPv6,
  CLOUDINARY_HOSTS,
} from './url-guard';

const HOSTS = ['res.cloudinary.com'];

beforeEach(() => {
  lookupMock.mockReset();
});

describe('CLOUDINARY_HOSTS', () => {
  it('contém res.cloudinary.com', () => {
    expect(CLOUDINARY_HOSTS).toContain('res.cloudinary.com');
  });
});

describe('isPrivateIPv4', () => {
  it('detecta faixas privadas/loopback/link-local/CGNAT', () => {
    for (const ip of ['127.0.0.1', '10.1.2.3', '172.16.5.5', '192.168.0.1', '169.254.1.1', '0.0.0.0', '100.64.0.1']) {
      expect(isPrivateIPv4(ip)).toBe(true);
    }
  });

  it('aceita IP público (inclusive 172.32.x fora do /12)', () => {
    expect(isPrivateIPv4('104.18.0.1')).toBe(false);
    expect(isPrivateIPv4('8.8.8.8')).toBe(false);
    expect(isPrivateIPv4('172.32.0.1')).toBe(false);
  });
});

describe('isPrivateIPv6', () => {
  it('detecta loopback, link-local, ULA e v4-mapped privado', () => {
    for (const ip of ['::1', '::', 'fe80::1', 'fc00::1', 'fd12::3', '::ffff:127.0.0.1']) {
      expect(isPrivateIPv6(ip)).toBe(true);
    }
  });

  it('aceita v6 público e v4-mapped público', () => {
    expect(isPrivateIPv6('2606:4700::1')).toBe(false);
    expect(isPrivateIPv6('::ffff:8.8.8.8')).toBe(false);
  });
});

describe('assertPublicHttpsUrl', () => {
  it('rejeita não-https (sem nem resolver DNS)', async () => {
    await expect(assertPublicHttpsUrl('http://res.cloudinary.com/x.png', { allowedHosts: HOSTS })).rejects.toThrow();
    expect(lookupMock).not.toHaveBeenCalled();
  });

  it('rejeita host fora da allowlist', async () => {
    await expect(assertPublicHttpsUrl('https://evil.example.com/x.png', { allowedHosts: HOSTS })).rejects.toThrow();
  });

  it('rejeita quando o host resolve para IP privado (ex.: metadata)', async () => {
    lookupMock.mockResolvedValue([{ address: '169.254.169.254', family: 4 }]);
    await expect(assertPublicHttpsUrl('https://res.cloudinary.com/x.png', { allowedHosts: HOSTS })).rejects.toThrow();
  });

  it('rejeita se QUALQUER endereço resolvido for privado', async () => {
    lookupMock.mockResolvedValue([
      { address: '104.18.0.1', family: 4 },
      { address: '10.0.0.5', family: 4 },
    ]);
    await expect(assertPublicHttpsUrl('https://res.cloudinary.com/x.png', { allowedHosts: HOSTS })).rejects.toThrow();
  });

  it('aceita https + host permitido + IP público', async () => {
    lookupMock.mockResolvedValue([{ address: '104.18.0.1', family: 4 }]);
    const u = await assertPublicHttpsUrl('https://res.cloudinary.com/demo/image.png', { allowedHosts: HOSTS });
    expect(u.hostname).toBe('res.cloudinary.com');
  });
});

describe('safeFetch', () => {
  it('valida e faz fetch SEM seguir redirect', async () => {
    lookupMock.mockResolvedValue([{ address: '104.18.0.1', family: 4 }]);
    const fetchMock = vi.fn().mockResolvedValue(new Response('ok'));
    vi.stubGlobal('fetch', fetchMock);
    await safeFetch('https://res.cloudinary.com/x.png', { allowedHosts: HOSTS });
    expect(fetchMock).toHaveBeenCalledWith(expect.any(URL), { redirect: 'error' });
    vi.unstubAllGlobals();
  });

  it('NÃO faz fetch se a validação falhar', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await expect(safeFetch('http://res.cloudinary.com/x.png', { allowedHosts: HOSTS })).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
