import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock do AWS SDK (hoisted) — nenhum teste conecta no MinIO de verdade
const sendMock = vi.hoisted(() => vi.fn());

vi.mock('@aws-sdk/client-s3', () => {
  class Cmd {
    input: unknown;
    type: string;
    constructor(input: unknown, type: string) {
      this.input = input;
      this.type = type;
    }
  }
  return {
    S3Client: vi.fn(() => ({ send: sendMock })),
    HeadBucketCommand: class extends Cmd { constructor(i: unknown) { super(i, 'Head'); } },
    CreateBucketCommand: class extends Cmd { constructor(i: unknown) { super(i, 'Create'); } },
    PutObjectCommand: class extends Cmd { constructor(i: unknown) { super(i, 'Put'); } },
    GetObjectCommand: class extends Cmd { constructor(i: unknown) { super(i, 'Get'); } },
  };
});

import { extractObjectKey, contentTypeFromKey, uploadBase64Image, getObjectBytes } from './minio';

beforeEach(() => {
  sendMock.mockReset();
  sendMock.mockImplementation(async (cmd: { type: string }) => {
    if (cmd.type === 'Get') {
      return { Body: { transformToByteArray: async () => new Uint8Array([1, 2, 3]) } };
    }
    return {};
  });
});

describe('extractObjectKey', () => {
  it('extrai a key de URL pública do MinIO', () => {
    expect(
      extractObjectKey('https://dados-minio.v1dvzt.easypanel.host/projeto-rh/curriculos/x.pdf'),
    ).toBe('curriculos/x.pdf');
  });

  it('normaliza portas :443 e :9000', () => {
    expect(extractObjectKey('https://host:443/projeto-rh/curriculos/a.pdf')).toBe('curriculos/a.pdf');
    expect(extractObjectKey('http://host:9000/projeto-rh/curriculos/b.pdf')).toBe('curriculos/b.pdf');
  });

  it('conserta URL malformada https:/', () => {
    expect(extractObjectKey('https:/host/projeto-rh/curriculos/c.pdf')).toBe('curriculos/c.pdf');
  });

  it('mantém key crua', () => {
    expect(extractObjectKey('curriculos/x.pdf')).toBe('curriculos/x.pdf');
  });

  it('retorna null para legado em disco, URL externa e vazio', () => {
    expect(extractObjectKey('/uploads/curriculos/x.pdf')).toBeNull();
    expect(extractObjectKey('https://outro-host.com/bucket/x.pdf')).toBeNull();
    expect(extractObjectKey('')).toBeNull();
    expect(extractObjectKey(null)).toBeNull();
    expect(extractObjectKey(undefined)).toBeNull();
  });
});

describe('contentTypeFromKey', () => {
  it('mapeia extensões para content-type', () => {
    expect(contentTypeFromKey('fotos/x.png')).toBe('image/png');
    expect(contentTypeFromKey('fotos/x.jpg')).toBe('image/jpeg');
    expect(contentTypeFromKey('fotos/x.jpeg')).toBe('image/jpeg');
    expect(contentTypeFromKey('fotos/x.webp')).toBe('image/webp');
    expect(contentTypeFromKey('fotos/x.gif')).toBe('image/gif');
    expect(contentTypeFromKey('curriculos/x.pdf')).toBe('application/pdf');
    expect(contentTypeFromKey('fotos/x.desconhecido')).toBe('image/jpeg');
  });
});

describe('uploadBase64Image', () => {
  it('mantém valor que já é key (idempotente, sem upload)', async () => {
    expect(await uploadBase64Image('fotos/usuarios/x.jpg', 'fotos/usuarios')).toBe('fotos/usuarios/x.jpg');
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('mantém URL externa (não re-sobe)', async () => {
    expect(await uploadBase64Image('https://x/y.png', 'fotos/usuarios')).toBe('https://x/y.png');
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('retorna null para vazio e null', async () => {
    expect(await uploadBase64Image('', 'fotos/usuarios')).toBeNull();
    expect(await uploadBase64Image(null, 'fotos/usuarios')).toBeNull();
  });

  it('sobe data URL e retorna key com a extensão do mime', async () => {
    const key = await uploadBase64Image('data:image/png;base64,aGVsbG8=', 'fotos/usuarios');
    expect(key).toMatch(/^fotos\/usuarios\/[0-9a-f]+\.png$/);
    expect(sendMock).toHaveBeenCalled();
  });

  it('sobe base64 cru (sem data:) como jpg', async () => {
    const key = await uploadBase64Image('aGVsbG8gd29ybGQ=', 'fotos/candidatos');
    expect(key).toMatch(/^fotos\/candidatos\/[0-9a-f]+\.jpg$/);
  });
});

describe('getObjectBytes', () => {
  it('retorna os bytes do objeto via GetObject', async () => {
    const bytes = await getObjectBytes('fotos/x.jpg');
    expect(bytes).toEqual(new Uint8Array([1, 2, 3]));
  });
});
