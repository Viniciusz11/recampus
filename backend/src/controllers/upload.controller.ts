import type { Request, Response } from 'express';
import { uploadService } from '@/container';
import { AppError } from '@/utils/AppError';

const uploadImage = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) throw new AppError('Nenhum arquivo de imagem foi enviado', 400, 'FILE_REQUIRED');

  const url = await uploadService.uploadAdImage(req.file.buffer);
  res.status(201).json({ url });
};

export const uploadController = { uploadImage };
