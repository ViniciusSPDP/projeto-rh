// src/lib/auth.ts
import bcrypt from 'bcryptjs'

/**
 * Recebe uma senha em texto puro e retorna o hash bcrypt.
 * @param plainTextPassword Senha em texto puro
 */
export async function hashPassword(plainTextPassword: string): Promise<string> {
  const saltRounds = 10                 // custo de processamento
  const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(plainTextPassword, salt)
  return hash
}
