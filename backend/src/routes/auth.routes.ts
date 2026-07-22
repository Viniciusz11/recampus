import { Router } from 'express';
import { authController } from '@/controllers/auth.controller';
import { env } from '@/config/env';
import { createRateLimiter } from '@/middlewares/rateLimiter';
import { validate } from '@/middlewares/validate';
import { loginSchema, registerSchema } from '@/schemas/auth.schemas';

export const authRoutes = Router();

// Só em /register e /login: são os alvos reais de brute-force. /refresh é
// chamado automaticamente pelo app a cada carregamento de página (inclusive
// 2x em dev por causa do StrictMode) - um limite agressivo ali penalizaria
// uso normal, não ataque.
const authRateLimiter = createRateLimiter(env.AUTH_RATE_LIMIT_MAX);

authRoutes.post('/register', authRateLimiter, validate(registerSchema), authController.register);
authRoutes.post('/login', authRateLimiter, validate(loginSchema), authController.login);
// Bônus além do mínimo do edital: refresh token rotativo + logout que
// revoga de fato (ver Etapa 1/3) - o token vem do cookie httpOnly, não do body.
authRoutes.post('/refresh', authController.refresh);
authRoutes.post('/logout', authController.logout);
