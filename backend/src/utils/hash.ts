import bcrypt from 'bcrypt';
import { createHash } from 'node:crypto';

const SALT_ROUNDS = 10;

export function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export function comparePassword(plainPassword: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hash);
}

/**
 * SHA-256 (não bcrypt) para o refresh token: ao contrário da senha, o token
 * já é aleatório e de alta entropia (gerado pelo próprio jsonwebtoken), então
 * não precisa de salt nem de um algoritmo lento contra brute-force - só
 * precisamos que, se o banco vazar, o token da tabela não seja usável
 * diretamente. Comparação é feita como string exata (findUnique por hash).
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
