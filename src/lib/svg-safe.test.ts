import { describe, it, expect } from 'vitest';
import { escapeHtml, safeColor, safeFontFamily, num } from './svg-safe';

describe('escapeHtml', () => {
  it('escapa <, >, &, aspas simples e duplas', () => {
    expect(escapeHtml(`<script>"'&`)).toBe('&lt;script&gt;&quot;&#039;&amp;');
  });
});

describe('safeColor', () => {
  it('aceita hex, rgb/rgba e nome de cor simples', () => {
    expect(safeColor('#fff')).toBe('#fff');
    expect(safeColor('#a1b2c3')).toBe('#a1b2c3');
    expect(safeColor('rgb(1, 2, 3)')).toBe('rgb(1, 2, 3)');
    expect(safeColor('rgba(1,2,3,0.5)')).toBe('rgba(1,2,3,0.5)');
    expect(safeColor('red')).toBe('red');
  });

  it('bloqueia valor com aspas/handler e cai no preto', () => {
    expect(safeColor(`red" onload="alert(1)`)).toBe('#000000');
    expect(safeColor(`#fff"><script>`)).toBe('#000000');
    expect(safeColor(undefined)).toBe('#000000');
    expect(safeColor(123)).toBe('#000000');
  });
});

describe('safeFontFamily', () => {
  it('mantém família da allowlist', () => {
    expect(safeFontFamily('Arial')).toBe('Arial');
    expect(safeFontFamily('Arial, sans-serif')).toBe('Arial, sans-serif');
  });

  it('substitui família desconhecida/maliciosa pelo default', () => {
    expect(safeFontFamily(`Arial" onload="x`)).toBe('Arial, sans-serif');
    expect(safeFontFamily(undefined)).toBe('Arial, sans-serif');
  });
});

describe('num', () => {
  it('coage número válido', () => {
    expect(num('42', 0)).toBe(42);
    expect(num(10, 0)).toBe(10);
  });

  it('usa o fallback para NaN/Infinity/injeção', () => {
    expect(num('12" onload="x', 5)).toBe(5);
    expect(num(undefined, 7)).toBe(7);
    expect(num(Infinity, 3)).toBe(3);
    expect(num(NaN, 9)).toBe(9);
  });
});
