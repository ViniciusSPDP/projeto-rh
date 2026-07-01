// scripts/set-admin.js
//
// Promove (ou rebaixa) o papel de um usuário. Usado para bootstrap do RBAC e ajustes
// finos depois da migration `add_role`.
//
// Uso:
//   node scripts/set-admin.js <email>            -> define o usuário como ADMIN
//   node scripts/set-admin.js <email> USER       -> rebaixa para USER
//   npm run set-admin -- <email>
//
// Dica: para descobrir os e-mails, rode `npx prisma studio` ou consulte a tabela
// `usuario` ordenada por id/criadoem.

const fs = require('fs');
const path = require('path');

// --- Carrega .env (mesmo padrão dos outros scripts) ---
(function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const val = m[2].trim().replace(/^["']|["']$/g, '');
    if (process.env[m[1]] === undefined) process.env[m[1]] = val;
  }
})();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const role = (process.argv[3] || 'ADMIN').toUpperCase();

  if (!email) {
    console.error('Uso: node scripts/set-admin.js <email> [ADMIN|USER]');
    process.exit(1);
  }
  if (role !== 'ADMIN' && role !== 'USER') {
    console.error(`Papel inválido: ${role}. Use ADMIN ou USER.`);
    process.exit(1);
  }

  const user = await prisma.usuario.update({
    where: { email },
    data: { role },
  });
  console.log(`OK: ${user.email} -> ${user.role}`);
}

main()
  .catch((e) => {
    console.error('Falha ao atualizar papel:', e.message || e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
