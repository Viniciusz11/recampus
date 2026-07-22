import { Router } from 'express';
import { uploadController } from '@/controllers/upload.controller';
import { authGuard } from '@/middlewares/authGuard';
import { uploadImageMiddleware } from '@/middlewares/upload';

export const uploadRoutes = Router();

uploadRoutes.post('/image', authGuard, uploadImageMiddleware, uploadController.uploadImage);
