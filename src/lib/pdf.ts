// src/lib/pdf.ts
//
// Checagem de "magic bytes" de PDF. Todo PDF válido começa com "%PDF-"
// (bytes 25 50 44 46 2D). Serve para rejeitar um arquivo não-PDF renomeado
// com extensão .pdf / Content-Type application/pdf forjado.
export function isPdfBuffer(buf: Buffer): boolean {
  return (
    buf.length >= 5 &&
    buf[0] === 0x25 && // %
    buf[1] === 0x50 && // P
    buf[2] === 0x44 && // D
    buf[3] === 0x46 && // F
    buf[4] === 0x2d    // -
  );
}
