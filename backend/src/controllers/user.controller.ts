import type { Request, Response } from 'express';
import { userService } from '@/container';
import { AppError } from '@/utils/AppError';

const me = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) throw AppError.unauthorized();
  const user = await userService.getById(req.user.id);
  res.status(200).json({ user });
};

export const userController = { me };
