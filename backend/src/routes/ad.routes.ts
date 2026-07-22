import { Router } from 'express';
import { adController } from '@/controllers/ad.controller';
import { authGuard } from '@/middlewares/authGuard';
import { validate } from '@/middlewares/validate';
import {
  adIdParamSchema,
  createAdSchema,
  listAdsQuerySchema,
  updateAdSchema,
} from '@/schemas/ad.schemas';

export const adRoutes = Router();

// Público: vitrine e detalhe não exigem login.
adRoutes.get('/', validate(listAdsQuerySchema, 'query'), adController.list);
adRoutes.get('/:id', validate(adIdParamSchema, 'params'), adController.getById);

// Protegido: criar/editar/excluir exige autenticação (edição e exclusão
// checam posse do anúncio dentro do AdService).
adRoutes.post('/', authGuard, validate(createAdSchema), adController.create);
adRoutes.put(
  '/:id',
  authGuard,
  validate(adIdParamSchema, 'params'),
  validate(updateAdSchema),
  adController.update,
);
adRoutes.delete('/:id', authGuard, validate(adIdParamSchema, 'params'), adController.delete);
