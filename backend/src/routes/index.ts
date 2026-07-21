import { Router } from 'express';

export const router = Router();

/**
 * Health check simples para validar deploy (Render) e uptime monitors.
 * As rotas de domínio (auth, ads) são montadas aqui na Etapa 4.
 */
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
