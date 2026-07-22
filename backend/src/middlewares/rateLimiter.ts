import rateLimit, { type RateLimitRequestHandler } from 'express-rate-limit';
import { env } from '@/config/env';

export function createRateLimiter(limit: number): RateLimitRequestHandler {
  return rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: { message: 'Muitas requisições. Tente novamente mais tarde.', code: 'RATE_LIMITED' },
    },
  });
}
