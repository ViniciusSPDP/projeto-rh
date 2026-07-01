// src/lib/url-guard.ts
//
// Guard anti-SSRF para URLs que o servidor busca (ex.: imagem de fundo de template).
// Regras: exige HTTPS, host tem que estar na allowlist, e o(s) IP(s) resolvido(s) NÃO
// podem ser privados/loopback/link-local. `safeFetch` ainda usa redirect: 'error' para
// impedir bounce (redirect) de um host permitido para um destino interno.
//
// Observação: a allowlist de host (res.cloudinary.com) é o controle principal; a checagem
// de IP é uma camada extra. Não fazemos IP-pinning no fetch (TLS/SNI), então contra DNS
// rebinding puro a defesa real é a allowlist de host.

import { lookup } from 'dns/promises';

export const CLOUDINARY_HOSTS = ['res.cloudinary.com'];

// [rede, bits] das faixas IPv4 não-públicas que devemos bloquear.
const PRIVATE_V4: Array<[string, number]> = [
  ['0.0.0.0', 8],       // "this" network
  ['10.0.0.0', 8],      // privada
  ['100.64.0.0', 10],   // CGNAT
  ['127.0.0.0', 8],     // loopback
  ['169.254.0.0', 16],  // link-local
  ['172.16.0.0', 12],   // privada
  ['192.168.0.0', 16],  // privada
];

function ipv4ToInt(ip: string): number {
  return ip.split('.').reduce((acc, oct) => ((acc << 8) + Number(oct)) >>> 0, 0) >>> 0;
}

function inCidrV4(ip: string, network: string, bits: number): boolean {
  const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
  return (ipv4ToInt(ip) & mask) === (ipv4ToInt(network) & mask);
}

export function isPrivateIPv4(ip: string): boolean {
  return PRIVATE_V4.some(([network, bits]) => inCidrV4(ip, network, bits));
}

export function isPrivateIPv6(ip: string): boolean {
  const a = ip.toLowerCase();
  if (a === '::1' || a === '::') return true;          // loopback / unspecified
  if (a.startsWith('fe80')) return true;                // link-local fe80::/10
  if (a.startsWith('fc') || a.startsWith('fd')) return true; // ULA fc00::/7
  // IPv4-mapeado (::ffff:127.0.0.1) — extrai o IPv4 e reavalia.
  if (a.startsWith('::ffff:')) {
    const tail = a.slice('::ffff:'.length);
    if (tail.includes('.')) return isPrivateIPv4(tail);
  }
  return false;
}

function isPrivateAddress(address: string, family: number): boolean {
  return family === 6 ? isPrivateIPv6(address) : isPrivateIPv4(address);
}

/**
 * Valida a URL e resolve o host. Lança Error se: não for https, host fora da allowlist,
 * DNS não resolver, ou qualquer endereço resolvido for privado/loopback/link-local.
 */
export async function assertPublicHttpsUrl(
  raw: string,
  opts: { allowedHosts: string[] },
): Promise<URL> {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new Error('URL inválida');
  }
  if (u.protocol !== 'https:') throw new Error('Somente HTTPS é permitido');

  const host = u.hostname.toLowerCase();
  if (!opts.allowedHosts.includes(host)) throw new Error('Host não permitido');

  const addrs = await lookup(host, { all: true });
  if (!addrs || addrs.length === 0) throw new Error('DNS não resolveu');
  for (const { address, family } of addrs) {
    if (isPrivateAddress(address, family)) {
      throw new Error('Endereço de destino não é público');
    }
  }
  return u;
}

/**
 * Faz fetch da URL somente após validação, sem seguir redirects (evita bounce p/ interno).
 */
export async function safeFetch(
  raw: string,
  opts: { allowedHosts: string[] },
): Promise<Response> {
  const u = await assertPublicHttpsUrl(raw, opts);
  return fetch(u, { redirect: 'error' });
}
