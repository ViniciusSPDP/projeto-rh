// src/lib/rate-limit.ts
//
// Rate limiter simples em memória (janela fixa por chave). É uma PRIMEIRA CAMADA
// best-effort. Limitações conhecidas:
// - por PROCESSO: não é compartilhado entre instâncias e reseta a cada redeploy;
// - o IP vem de x-forwarded-for, que só é confiável se o reverse proxy à frente
//   sobrescreve o header. O controle forte de abuso deve ficar no proxy/WAF.

import { NextResponse } from 'next/server';

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();

  // Varredura oportunista para não crescer sem limite (ex.: XFF spoofado).
  if (store.size > 5000) {
    for (const [k, e] of store) {
      if (now >= e.resetAt) store.delete(k);
    }
  }

  const entry = store.get(key);
  if (!entry || now >= entry.resetAt) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }
  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }
  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

export function rateLimitResponse(result: RateLimitResult): NextResponse {
  const retryAfter = Math.max(1, Math.ceil((result.resetAt - Date.now()) / 1000));
  return NextResponse.json(
    { error: 'Muitas requisições. Tente novamente em instantes.' },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } },
  );
}

// Exposto só para testes (permite limpar o estado entre casos).
export function __resetRateLimitStore(): void {
  store.clear();
}
