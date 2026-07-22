import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

type ValidationSource = 'body' | 'query' | 'params';

/**
 * Fábrica de middleware de validação. Erros de parsing viram ZodError, que
 * o errorHandler central já sabe transformar em 400 com os campos inválidos
 * - o controller nunca precisa validar nada manualmente.
 *
 * No Express 5, `req.query` passou a ser um getter sem setter (lido do
 * parser de query configurado), então `req.query = valorParseado` lança
 * "Cannot set property query of #<IncomingMessage> which has only a
 * getter". `Object.defineProperty` substitui a propriedade por uma
 * gravável, contornando isso só para `query` (body/params continuam
 * graváveis normalmente).
 */
export function validate(schema: ZodType, source: ValidationSource = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed: unknown = schema.parse(req[source]);

    if (source === 'query') {
      Object.defineProperty(req, 'query', { value: parsed, writable: true, configurable: true });
    } else {
      req[source] = parsed;
    }

    next();
  };
}
