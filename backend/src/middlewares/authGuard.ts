import type { NextFunction, Request, Response } from 'express';
import { AppError } from '@/utils/AppError';
import { verifyAccessToken } from '@/utils/jwt';

/** Exige um "Authorization: Bearer <token>" válido e preenche req.user. */
export function authGuard(req: Request, _res: Response, next: NextFunction): void {
  const [scheme, token] = req.headers.authorization?.split(' ') ?? [];

  if (scheme !== 'Bearer' || !token) {
    throw AppError.unauthorized('Token de acesso não informado');
  }

  const payload = verifyAccessToken(token);
  req.user = { id: payload.sub, email: payload.email };
  next();
}
