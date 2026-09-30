import { Request, Response } from 'express';
import { query } from '../services/db/client.js';
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
  getCookieOptions,
  COOKIE_NAME,
} from '../services/auth/tokenService.js';
import { config } from '../config/index.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { AdminUser } from '../types/index.js';

export async function handleAdminLogin(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({
      error: { code: 'MISSING_FIELDS', message: 'Username and password are required.' },
    });
    return;
  }

  try {
    // 1. Check if user exists in database
    let adminRecord: any = null;
    const rows = await query<{
      id: string;
      email: string;
      username: string;
      password_hash: string;
      role: 'superadmin' | 'seo_manager' | 'viewer';
    }>(`SELECT * FROM admins WHERE email = $1 OR username = $1 LIMIT 1`, [username.trim()]);

    if (rows.length > 0) {
      adminRecord = rows[0];
      const valid = await verifyPassword(password, adminRecord.password_hash);
      if (!valid) {
        res.status(401).json({
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password.' },
        });
        return;
      }
    } else {
      // 2. If no admin in DB yet, check server environment INITIAL_ADMIN_PASSWORD
      if (
        config.initialAdminPassword &&
        (username === config.initialAdminEmail || username === 'admin') &&
        password === config.initialAdminPassword
      ) {
        const passHash = await hashPassword(password);
        try {
          const inserted = await query(
            `INSERT INTO admins (email, username, password_hash, role)
             VALUES ($1, $2, $3, 'superadmin')
             RETURNING id, email, username, role`,
            [config.initialAdminEmail, 'SuperAdmin', passHash]
          );
          adminRecord = inserted[0];
        } catch {
          adminRecord = {
            id: 'admin_initial_01',
            email: config.initialAdminEmail,
            username: 'SuperAdmin',
            role: 'superadmin',
          };
        }
      } else {
        res.status(401).json({
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password.' },
        });
        return;
      }
    }

    const adminUser: AdminUser = {
      id: adminRecord.id,
      email: adminRecord.email,
      username: adminRecord.username,
      role: adminRecord.role,
    };

    const sid = await createSession(adminUser);
    res.cookie(COOKIE_NAME, sid, getCookieOptions());

    res.json({
      success: true,
      user: adminUser,
    });
  } catch (err: any) {
    res.status(500).json({
      error: { code: 'AUTH_ERROR', message: err?.message || 'Authentication error' },
    });
  }
}

export async function handleAdminLogout(req: Request, res: Response) {
  const sid = req.cookies?.[COOKIE_NAME];
  if (sid) {
    await destroySession(sid);
  }
  res.clearCookie(COOKIE_NAME, getCookieOptions());
  res.json({ success: true, message: 'Logged out successfully.' });
}

export async function handleAdminMe(req: AuthenticatedRequest, res: Response) {
  res.json({
    authenticated: true,
    user: req.admin,
  });
}
