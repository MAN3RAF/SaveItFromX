import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = typeof err.status === 'number' ? err.status : 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'An unexpected server error occurred';

  // Never log passwords, tokens or expose stack traces to client in production
  if (config.nodeEnv !== 'production') {
    console.error('[Server Error]:', err);
  } else {
    console.error(`[Server Error] ${code}: ${message}`);
  }

  res.status(status).json({
    error: {
      code,
      message,
    },
  });
}
