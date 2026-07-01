// src/lib/svg-safe.ts
//
// Helpers para montar SVG a partir de dados do usuário (template de imagem) sem permitir
// injeção de markup/handlers — nem via TEXTO (escapeHtml) nem via ATRIBUTOS (fill,
// font-family, geometria). Extraído para ser testável isoladamente.

export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const ALLOWED_FONT_FAMILIES = [
  'Arial, sans-serif', 'Arial', 'Helvetica', 'Georgia',
  'Times New Roman', 'Verdana', 'Courier New',
];

// Só permite famílias conhecidas; qualquer outra coisa vira o default seguro.
export function safeFontFamily(value?: string): string {
  return value && ALLOWED_FONT_FAMILIES.includes(value) ? value : 'Arial, sans-serif';
}

// Aceita hex (#rgb..#rrggbbaa), rgb()/rgba() ou nome de cor simples; senão, preto.
export function safeColor(value: unknown): string {
  const s = String(value ?? '');
  const ok =
    /^#[0-9a-fA-F]{3,8}$/.test(s) ||
    /^rgba?\(\s*[\d.,\s%]+\)$/.test(s) ||
    /^[a-zA-Z]{1,32}$/.test(s);
  return ok ? s : '#000000';
}

// Número finito ou fallback (evita NaN e injeção via atributos numéricos).
export function num(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}
