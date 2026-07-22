import { z } from 'zod';
import { AdStatus, AdType, Category } from '@prisma/client';

const categorySchema = z.enum(Category);
const adTypeSchema = z.enum(AdType);
const adStatusSchema = z.enum(AdStatus);

/**
 * Shape básico dos campos - a regra "doação não tem preço, venda exige
 * preço" é semântica (depende de dois campos e, no update, do estado atual
 * do anúncio) e por isso vive no AdService, não aqui (ver Etapa 3).
 */
export const createAdSchema = z.object({
  title: z.string().trim().min(3, 'Título deve ter pelo menos 3 caracteres').max(120),
  description: z.string().trim().min(10, 'Descrição deve ter pelo menos 10 caracteres').max(2000),
  category: categorySchema,
  type: adTypeSchema,
  price: z.coerce.number().positive('Preço deve ser maior que zero').optional(),
  imageUrl: z.string().trim().url('URL de imagem inválida'),
});
export type CreateAdInput = z.infer<typeof createAdSchema>;

export const updateAdSchema = createAdSchema.partial().extend({
  status: adStatusSchema.optional(),
});
export type UpdateAdInput = z.infer<typeof updateAdSchema>;

export const listAdsQuerySchema = z.object({
  category: categorySchema.optional(),
  type: adTypeSchema.optional(),
  status: adStatusSchema.optional(),
  q: z.string().trim().min(1).max(120).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
});
export type ListAdsQuery = z.infer<typeof listAdsQuerySchema>;

export const listMyAdsQuerySchema = z.object({
  status: adStatusSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
});
export type ListMyAdsQuery = z.infer<typeof listMyAdsQuerySchema>;

export const adIdParamSchema = z.object({
  id: z.string().uuid('ID de anúncio inválido'),
});
