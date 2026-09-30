import { Request, Response, NextFunction } from 'express';
import { validateSession, COOKIE_NAME } from '../services/auth/tokenService.js';
import { AdminUser } from '../types/index.js';

export interface AuthenticatedRequest extends Request {
  admin?: AdminUser;
}

export async function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const sessionId = req.cookies?.[COOKIE_NAME];

  if (!sessionId) {
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Administrator authentication required.',
      },
    });
    return;
  }

  const user = await validateSession(sessionId);
  if (!user) {
    res.status(401).json({
      error: {
        code: 'SESSION_EXPIRED',
        message: 'Session is invalid or expired. Please log in again.',
      },
    });
    return;
  }

  req.admin = user;
  next();
}
