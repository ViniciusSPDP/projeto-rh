// src/lib/validation/candidato.ts
//
// Whitelist explícita dos campos graváveis de `Candidatos` (Prisma). É a única fonte de
// verdade usada pelas rotas de criação/edição de candidato para evitar MASS ASSIGNMENT:
// o body cru NUNCA vai para o Prisma — só `schema.safeParse(body).data` (campos conhecidos).
//
// Comportamento:
// - `z.object` (default) FAZ STRIP de chaves desconhecidas (idCandidato, curriculoUrl,
//   created_at, __proto__, vagaId, consentimento, ...). Não usamos `.strict()` de propósito,
//   para os extras legítimos (vagaId/consentimento) não causarem 400.
// - String vazia/whitespace vira `undefined` (campo omitido → Prisma usa o default/null).
// - Datas: '' | null → null; string inválida → null; ISO válida → Date; AUSENTE → omitido
//   (num PATCH parcial, campo não enviado não é tocado).

import { z } from 'zod';

// String opcional: '' / whitespace → undefined (omitido); senão mantém a string.
const optStr = z.preprocess(
  (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
  z.string().optional(),
);

// Data opcional. IMPORTANTE: undefined permanece undefined (campo ausente não é alterado
// no update parcial); só '' / null explícitos zeram para null.
const optDate = z.preprocess((v) => {
  if (v === undefined) return undefined;
  if (v === '' || v === null) return null;
  const d = new Date(v as string);
  return isNaN(d.getTime()) ? null : d;
}, z.date().nullable().optional());

// Todos os campos String? de Candidatos (exceto os NÃO-graváveis: idCandidato, created_at,
// curriculoUrl, observacaoUpdatedAt — esses nunca entram por aqui).
const candidatoShape = {
  nomeCandidato: optStr,
  cpfCandidato: optStr,
  rgCandidato: optStr,
  sexoCandidato: optStr,
  estadocivilCandidato: optStr,
  cnhCandidato: optStr,
  outrosexoCandidato: optStr,
  categoriacnhCandidato: optStr,
  emailCandidato: optStr,
  linkedinCandidato: optStr,
  facebookCandidato: optStr,
  instagramCandidato: optStr,
  telefoneCandidato: optStr,
  telefone2Candidato: optStr,
  pcdCandidato: optStr,
  cidareacandidato: optStr,
  cepCandidato: optStr,
  ruaCandidato: optStr,
  numeroCandidato: optStr,
  bairroCandidato: optStr,
  cidadeCandidato: optStr,
  estadoCandidato: optStr,
  vagainteresseCandidato: optStr,
  escolaridadeCandidato: optStr,
  conhecimentosCandidato: optStr,
  wordCandidato: optStr,
  excelCandidato: optStr,
  powerpointCandidato: optStr,
  conhecimentosinformaticaCandidato: optStr,
  conhecimentoinfcandidato: optStr,
  possuiexperienciaCandidato: optStr,
  empresaCandidato: optStr,
  local1Candidato: optStr,
  atividadesdesenvolvidas1Candidato: optStr,
  trabalha1Candidato: optStr,
  empresa2Candidato: optStr,
  local2Candidato: optStr,
  atividadesdesenvolvidas2Candidato: optStr,
  trabalha2Candidato: optStr,
  empresa3Candidato: optStr,
  local3Candidato: optStr,
  atividadesdesenvolvidas3Candidato: optStr,
  trabalha3Candidato: optStr,
  fotoCandidato: optStr, // valor cru; o UPLOAD é feito na rota, não persiste direto
  parentescoCandidato: optStr,
  graudeparentescoenomeCandidato: optStr,
  situacaoCandidato: optStr,
  opcionalCandidato: optStr,
  observacaoCandidato: optStr,
  // Datas (DateTime? @db.Date)
  datanascimentoCandidato: optDate,
  datainicioCandidato: optDate,
  datafinalCandidato: optDate,
  datainicio2Candidato: optDate,
  datafinal2Candidato: optDate,
  datainicio3Candidato: optDate,
  datafinal3Candidato: optDate,
  datacadastroCandidato: optDate,
} as const;

// Criação (público/manual): campos opcionais, chaves desconhecidas removidas por strip.
export const candidatoCreateSchema = z.object(candidatoShape);

// Edição (PATCH): parcial — só os campos enviados são atualizados.
export const candidatoUpdateSchema = candidatoCreateSchema.partial();

export type CandidatoCreateInput = z.infer<typeof candidatoCreateSchema>;
export type CandidatoUpdateInput = z.infer<typeof candidatoUpdateSchema>;
