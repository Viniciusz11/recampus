import multer from 'multer';
import { AppError } from '@/utils/AppError';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * Memory storage (não disco): o arquivo vira um Buffer em req.file, repassado
 * direto pro Supabase Storage - o processo não precisa persistir nada
 * localmente, o que também evita lidar com disco efêmero em containers.
 */
export const uploadImageMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype !== 'image/png') {
      callback(new AppError('Apenas arquivos PNG são aceitos', 400, 'INVALID_FILE_TYPE'));
      return;
    }
    callback(null, true);
  },
}).single('image');
