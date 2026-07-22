import { Router } from 'express';
import { authController } from '@/controllers/auth.controller';
import { validate } from '@/middlewares/validate';
import { loginSchema, registerSchema } from '@/schemas/auth.schemas';

export const authRoutes = Router();

authRoutes.post('/register', validate(registerSchema), authController.register);
authRoutes.post('/login', validate(loginSchema), authController.login);
// Bônus além do mínimo do edital: refresh token rotativo + logout que
// revoga de fato (ver Etapa 1/3) - o token vem do cookie httpOnly, não do body.
authRoutes.post('/refresh', authController.refresh);
authRoutes.post('/logout', authController.logout);
