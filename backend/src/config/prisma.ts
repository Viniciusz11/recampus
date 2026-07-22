import { PrismaClient } from '@prisma/client';
import { isProduction } from '@/config/env';

/**
 * Instância única do Prisma Client reutilizada por toda a aplicação.
 * Criar um PrismaClient por requisição esgotaria o pool de conexões do
 * Postgres rapidamente sob carga.
 */
export const prisma = new PrismaClient({
  log: isProduction ? ['error', 'warn'] : ['error', 'warn', 'query'],
});
