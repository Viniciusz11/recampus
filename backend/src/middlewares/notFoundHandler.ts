import type { Request, Response } from 'express';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: {
      message: `Rota ${req.method} ${req.originalUrl} não existe`,
      code: 'ROUTE_NOT_FOUND',
    },
  });
}
