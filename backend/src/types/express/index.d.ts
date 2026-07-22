import type { AuthenticatedUser } from '@/types/auth';

declare global {
  namespace Express {
    interface Request {
      /** Preenchido pelo middleware authGuard após validar o JWT. */
      user?: AuthenticatedUser;
    }
  }
}

export {};
