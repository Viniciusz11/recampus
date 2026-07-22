import type { Request, Response } from 'express';
import { isProduction } from '@/config/env';
import { authService } from '@/container';
import type { LoginInput, RegisterInput } from '@/schemas/auth.schemas';
import { AppError } from '@/utils/AppError';
import { getTokenExpiry } from '@/utils/jwt';

const REFRESH_COOKIE_NAME = 'refreshToken';
// Escopado só nas rotas de auth: o navegador não envia esse cookie em
// nenhuma outra chamada da API (ex: GET /ads não recebe o refresh token).
const REFRESH_COOKIE_PATH = '/api/v1/auth';

function setRefreshCookie(res: Response, refreshToken: string): void {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    // Front e back ficam em domínios diferentes em produção (Vercel/Render),
    // então o cookie precisa de SameSite=None para ser enviado cross-site.
    // Em dev (localhost:5173 -> localhost:3333) "lax" já basta e permite
    // testar sem HTTPS.
    sameSite: isProduction ? 'none' : 'lax',
    expires: getTokenExpiry(refreshToken),
    path: REFRESH_COOKIE_PATH,
  });
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
}

function getRefreshCookieValue(req: Request): string | undefined {
  const raw: unknown = (req.cookies as Record<string, unknown> | undefined)?.[REFRESH_COOKIE_NAME];
  return typeof raw === 'string' && raw.length > 0 ? raw : undefined;
}

function readRefreshCookie(req: Request): string {
  const raw = getRefreshCookieValue(req);
  if (!raw) throw AppError.unauthorized('Refresh token não informado');
  return raw;
}

// Arrow functions (não métodos de objeto): quando o Express chama
// `authController.register` como referência solta, um método normal
// perderia o binding de `this` (é o que a regra unbound-method aponta).
// Nenhum handler aqui usa `this`, então arrow function resolve na raiz.

const register = async (req: Request, res: Response): Promise<void> => {
  const input = req.body as RegisterInput;
  const { user, accessToken, refreshToken } = await authService.register(input);
  setRefreshCookie(res, refreshToken);
  res.status(201).json({ user, accessToken });
};

const login = async (req: Request, res: Response): Promise<void> => {
  const input = req.body as LoginInput;
  const { user, accessToken, refreshToken } = await authService.login(input);
  setRefreshCookie(res, refreshToken);
  res.status(200).json({ user, accessToken });
};

const refresh = async (req: Request, res: Response): Promise<void> => {
  const rawRefreshToken = readRefreshCookie(req);
  const tokens = await authService.refresh(rawRefreshToken);
  setRefreshCookie(res, tokens.refreshToken);
  res.status(200).json({ accessToken: tokens.accessToken });
};

const logout = async (req: Request, res: Response): Promise<void> => {
  const raw = getRefreshCookieValue(req);
  if (raw) {
    await authService.logout(raw);
  }
  clearRefreshCookie(res);
  res.status(204).send();
};

export const authController = { register, login, refresh, logout };
