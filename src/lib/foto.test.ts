import { describe, it, expect } from 'vitest';
import { resolveFotoSrc } from './foto';

describe('resolveFotoSrc', () => {
  const proxy = '/api/candidatos/9/foto';

  it('retorna a URL do proxy para KEY do MinIO (fotos/)', () => {
    expect(resolveFotoSrc('fotos/candidatos/abc.jpg', proxy)).toBe(proxy);
  });

  it('usa o data URL legado diretamente', () => {
    const data = 'data:image/png;base64,iVBORw0K';
    expect(resolveFotoSrc(data, proxy)).toBe(data);
  });

  it('embute base64 cru legado (fotourl) como data URL jpeg', () => {
    expect(resolveFotoSrc('/9j/4AAQSkZJRg', proxy)).toBe('data:image/jpeg;base64,/9j/4AAQSkZJRg');
  });

  it('usa URL externa (http/https) diretamente', () => {
    expect(resolveFotoSrc('https://x.com/f.jpg', proxy)).toBe('https://x.com/f.jpg');
  });

  it('retorna null para vazio, null, undefined e só espaços', () => {
    expect(resolveFotoSrc('', proxy)).toBeNull();
    expect(resolveFotoSrc(null, proxy)).toBeNull();
    expect(resolveFotoSrc(undefined, proxy)).toBeNull();
    expect(resolveFotoSrc('   ', proxy)).toBeNull();
  });
});
