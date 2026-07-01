import { describe, it, expect } from 'vitest';
import {
  candidatoCreateSchema,
  candidatoUpdateSchema,
  candidatoPublicoCreateSchema,
} from './candidato';

describe('candidatoCreateSchema', () => {
  it('faz strip de chaves desconhecidas / não-graváveis (anti mass-assignment)', () => {
    const out = candidatoCreateSchema.parse({
      nomeCandidato: 'Ana',
      idCandidato: 999,
      curriculoUrl: 'hack',
      vagaId: 3,
      consentimento: true,
      created_at: '2020-01-01',
      role: 'ADMIN',
    });
    expect(out).toHaveProperty('nomeCandidato', 'Ana');
    for (const k of ['idCandidato', 'curriculoUrl', 'vagaId', 'consentimento', 'created_at', 'role']) {
      expect(out).not.toHaveProperty(k);
    }
  });

  it('transforma string vazia/whitespace em null (limpa o campo)', () => {
    const out = candidatoCreateSchema.parse({ nomeCandidato: '', emailCandidato: '  ' });
    expect(out.nomeCandidato).toBeNull();
    expect(out.emailCandidato).toBeNull();
  });

  it('coage datas: ISO -> Date, vazio -> null, lixo -> null', () => {
    const out = candidatoCreateSchema.parse({
      datanascimentoCandidato: '2000-05-10',
      datainicioCandidato: '',
      datafinalCandidato: 'nao-e-data',
    });
    expect(out.datanascimentoCandidato).toBeInstanceOf(Date);
    expect(out.datainicioCandidato).toBeNull();
    expect(out.datafinalCandidato).toBeNull();
  });

  it('não deixa __proto__ virar propriedade própria da saída', () => {
    const out = candidatoCreateSchema.parse(
      JSON.parse('{"nomeCandidato":"x","__proto__":{"admin":true}}'),
    );
    expect(out).toHaveProperty('nomeCandidato', 'x');
    expect(Object.prototype.hasOwnProperty.call(out, '__proto__')).toBe(false);
  });
});

describe('candidatoUpdateSchema (parcial)', () => {
  it('não inclui campos não enviados (não zera no update)', () => {
    const out = candidatoUpdateSchema.parse({ nomeCandidato: 'Bea' });
    expect(Object.keys(out)).toEqual(['nomeCandidato']);
  });

  it('objeto vazio -> {}; data enviada vazia -> null', () => {
    expect(candidatoUpdateSchema.parse({})).toEqual({});
    expect(candidatoUpdateSchema.parse({ datafinalCandidato: '' }).datafinalCandidato).toBeNull();
  });
});

describe('candidatoPublicoCreateSchema', () => {
  it('remove campos de workflow interno (situacao/observacao) mesmo se enviados', () => {
    const out = candidatoPublicoCreateSchema.parse({
      nomeCandidato: 'Ana',
      situacaoCandidato: 'Aprovado',
      observacaoCandidato: 'me contrata',
    });
    expect(out).toHaveProperty('nomeCandidato', 'Ana');
    expect(out).not.toHaveProperty('situacaoCandidato');
    expect(out).not.toHaveProperty('observacaoCandidato');
  });
});
