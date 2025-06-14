import { PrismaClient } from '@prisma/client'

// Declara um tipo para a nossa instância global do Prisma
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Cria a instância do Prisma, reutilizando a existente em desenvolvimento
const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma
}

// Essa linha ensina ao JSON como converter BigInt para uma string, evitando erros de serialização.
// A tipagem 'unknown' é usada para ser mais segura que 'any'.
(BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function () {
  return this.toString()
}

export default prisma