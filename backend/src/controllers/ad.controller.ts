import type { Request, Response } from 'express';
import { adService } from '@/container';
import type {
  CreateAdInput,
  ListAdsQuery,
  ListMyAdsQuery,
  UpdateAdInput,
} from '@/schemas/ad.schemas';
import { AppError } from '@/utils/AppError';

function requireUserId(req: Request): string {
  if (!req.user) throw AppError.unauthorized();
  return req.user.id;
}

const list = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, ...filters } = req.query as unknown as ListAdsQuery;
  const result = await adService.list({ filters, page, limit });
  res.status(200).json(result);
};

const getById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string };
  const ad = await adService.getById(id);
  res.status(200).json({ ad });
};

const create = async (req: Request, res: Response): Promise<void> => {
  const ownerId = requireUserId(req);
  const input = req.body as CreateAdInput;
  const ad = await adService.create(ownerId, input);
  res.status(201).json({ ad });
};

const update = async (req: Request, res: Response): Promise<void> => {
  const ownerId = requireUserId(req);
  const { id } = req.params as { id: string };
  const input = req.body as UpdateAdInput;
  const ad = await adService.update(id, ownerId, input);
  res.status(200).json({ ad });
};

const deleteAd = async (req: Request, res: Response): Promise<void> => {
  const ownerId = requireUserId(req);
  const { id } = req.params as { id: string };
  await adService.delete(id, ownerId);
  res.status(204).send();
};

const listMine = async (req: Request, res: Response): Promise<void> => {
  const ownerId = requireUserId(req);
  const { page, limit, status } = req.query as unknown as ListMyAdsQuery;
  const result = await adService.list({ filters: { ownerId, status }, page, limit });
  res.status(200).json(result);
};

export const adController = { list, getById, create, update, delete: deleteAd, listMine };
