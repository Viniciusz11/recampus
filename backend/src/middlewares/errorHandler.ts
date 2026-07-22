import type { NextFunction, Request, Response } from 'express';
import { MulterError } from 'multer';
import { ZodError } from 'zod';
import { AppError } from '@/utils/AppError';
import { isProduction } from '@/config/env';

interface ErrorResponseBody {
  error: {
    message: string;
    code: string;
    details?: Record<string, string[] | undefined>;
  };
}

/**
 * Middleware de erro central (4 parâmetros é o que o Express usa para
 * identificar um error handler). No Express 5, handlers async que rejeitam
 * já caem aqui automaticamente — nenhum controller precisa de try/catch.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response<ErrorResponseBody>,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        message: 'Dados inválidos',
        code: 'VALIDATION_ERROR',
        details: err.flatten().fieldErrors,
      },
    });
    return;
  }

  if (err instanceof MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? 'Imagem muito grande (máximo 5MB)' : 'Falha ao processar o arquivo enviado';
    res.status(400).json({ error: { message, code: err.code } });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: { message: err.message, code: err.code },
    });
    return;
  }

  console.error('[unhandled_error]', err);

  res.status(500).json({
    error: {
      message: isProduction ? 'Erro interno do servidor' : String(err),
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
}
