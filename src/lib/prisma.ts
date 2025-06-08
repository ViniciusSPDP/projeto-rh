// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client'

// ADICIONE ESTA LINHA - ELA RESOLVE O PROBLEMA PARA TODO O PROJETO
// Esta linha ensina ao JSON como converter BigInt para uma string.
(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

const prisma = new PrismaClient()

export default prisma