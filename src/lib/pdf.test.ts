import { describe, it, expect } from 'vitest';
import { isPdfBuffer } from './pdf';

describe('isPdfBuffer', () => {
  it('aceita conteúdo que começa com %PDF-', () => {
    expect(isPdfBuffer(Buffer.from('%PDF-1.7\n%âãÏÓ'))).toBe(true);
  });

  it('rejeita zip/docx (PK\\x03\\x04)', () => {
    expect(isPdfBuffer(Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x00]))).toBe(false);
  });

  it('rejeita buffer curto (< 5 bytes) e vazio', () => {
    expect(isPdfBuffer(Buffer.from('%PDF'))).toBe(false);
    expect(isPdfBuffer(Buffer.alloc(0))).toBe(false);
  });

  it('rejeita texto qualquer e "%PDF" sem hífen', () => {
    expect(isPdfBuffer(Buffer.from('hello pdf world'))).toBe(false);
    expect(isPdfBuffer(Buffer.from('%PDFx'))).toBe(false);
  });
});
