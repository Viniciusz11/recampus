import 'dotenv/config';
import { defineConfig } from 'prisma/config';

/**
 * Substitui o antigo campo `package.json#prisma` (removido no Prisma 7).
 * Ao existir um prisma.config.ts, a CLI para de carregar o .env sozinha
 * (diferente do comportamento antigo) - por isso o `import 'dotenv/config'`
 * explícito acima, garantindo que DATABASE_URL chegue até o schema.prisma.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
});
