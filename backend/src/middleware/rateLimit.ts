import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  count: number;
  resetAt: number;
}

const ipMap = new Map<string, RateLimitStore>();

// Periodic garbage collection for expired rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of ipMap.entries()) {
    if (now > value.resetAt) {
      ipMap.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();

export function createRateLimiter(windowMs: number, maxRequests: number, endpointType: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const rawIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || '127.0.0.1';
    const key = `${endpointType}:${rawIp}`;
    const now = Date.now();

    const record = ipMap.get(key);
    if (!record || now > record.resetAt) {
      ipMap.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    record.count++;
    if (record.count > maxRequests) {
      res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many requests for ${endpointType}. Please slow down.`,
        },
      });
      return;
    }

    next();
  };
}

export const downloadRateLimiter = createRateLimiter(60 * 1000, 15, 'media-downloads');
export const infoRateLimiter = createRateLimiter(60 * 1000, 45, 'public-metadata-lookup');
export const adminLoginRateLimiter = createRateLimiter(15 * 60 * 1000, 5, 'admin-login');
export const adminApiRateLimiter = createRateLimiter(60 * 1000, 120, 'admin-api');
