import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '@/config/env';
import { AppError } from '@/utils/AppError';

const accessTokenPayloadSchema = z.object({
  sub: z.string().uuid(),
  email: z.string().email(),
});
export type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;

const refreshTokenPayloadSchema = z.object({
  sub: z.string().uuid(),
});
export type RefreshTokenPayload = z.infer<typeof refreshTokenPayloadSchema>;

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

/**
 * Qualquer falha (assinatura inválida, expirado, payload com formato
 * inesperado) vira um único AppError 401 - quem chama não precisa saber
 * a diferença entre "token expirado" e "token malformado".
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    const decoded: unknown = jwt.verify(token, env.JWT_SECRET);
    return accessTokenPayloadSchema.parse(decoded);
  } catch {
    throw AppError.unauthorized('Token de acesso inválido ou expirado');
  }
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    const decoded: unknown = jwt.verify(token, env.REFRESH_TOKEN_SECRET);
    return refreshTokenPayloadSchema.parse(decoded);
  } catch {
    throw AppError.unauthorized('Refresh token inválido ou expirado');
  }
}

/**
 * Lê o `exp` de dentro do próprio token para persistir a expiração do
 * refresh token no banco - assim a validade gravada nunca diverge da
 * validade real assinada no JWT (uma única fonte de verdade).
 */
export function getTokenExpiry(token: string): Date {
  const decoded = jwt.decode(token);

  if (!decoded || typeof decoded === 'string' || typeof decoded.exp !== 'number') {
    throw new Error('Token não contém uma data de expiração válida');
  }

  return new Date(decoded.exp * 1000);
}
