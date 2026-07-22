import { Router } from 'express';
import { adController } from '@/controllers/ad.controller';
import { userController } from '@/controllers/user.controller';
import { authGuard } from '@/middlewares/authGuard';
import { validate } from '@/middlewares/validate';
import { adRoutes } from '@/routes/ad.routes';
import { authRoutes } from '@/routes/auth.routes';
import { listMyAdsQuerySchema } from '@/schemas/ad.schemas';

export const router = Router();

/** Health check simples para validar deploy (Render) e uptime monitors. */
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);

// /me e /my-ads ficam no nível raiz (não sob /auth ou /ads) para bater
// exatamente com os endpoints exigidos no edital.
router.get('/me', authGuard, userController.me);
router.use('/ads', adRoutes);
router.get(
  '/my-ads',
  authGuard,
  validate(listMyAdsQuerySchema, 'query'),
  adController.listMine,
);
