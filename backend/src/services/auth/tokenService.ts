import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { query } from '../db/client.js';
import { AdminUser } from '../../types/index.js';
import { config } from '../../config/index.js';

const memorySessions = new Map<string, { user: AdminUser; expiresAt: number }>();

export const COOKIE_NAME = 'saveitfromx_admin_sid';

/**
 * Cookie options tailored for cross-origin SPA (Vercel) -> API (Render) deployment
 * In production: secure: true, sameSite: 'none' (required for cross-origin credentials)
 * In development: secure: false, sameSite: 'lax'
 */
export function getCookieOptions() {
  const isProd = config.nodeEnv === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? ('none' as const) : ('lax' as const),
    path: '/',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  };
}

/**
 * Hash admin password using standard bcrypt with 12 salt rounds
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Verify password against bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;

  // Standard bcrypt comparison
  if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
    return bcrypt.compare(password, hash);
  }

  // Graceful fallback for legacy scrypt hashes during transition
  if (hash.includes(':')) {
    const parts = hash.split(':');
    if (parts.length === 2) {
      const [salt, key] = parts;
      return new Promise((resolve) => {
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
          if (err) return resolve(false);
          resolve(crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey));
        });
      });
    }
  }

  return false;
}

export async function createSession(user: AdminUser): Promise<string> {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

  // Persist to Postgres if connected
  try {
    await query(
      `INSERT INTO admin_sessions (id, admin_id, expires_at) VALUES ($1, $2, to_timestamp($3 / 1000.0))`,
      [sessionId, user.id, expiresAt]
    );
  } catch {
    // Memory fallback
    memorySessions.set(sessionId, { user, expiresAt });
  }

  memorySessions.set(sessionId, { user, expiresAt });
  return sessionId;
}

export async function validateSession(sessionId: string): Promise<AdminUser | null> {
  if (!sessionId) return null;

  const mem = memorySessions.get(sessionId);
  if (mem && mem.expiresAt > Date.now()) {
    return mem.user;
  }

  try {
    const rows = await query<{
      id: string;
      email: string;
      username: string;
      role: 'superadmin' | 'seo_manager' | 'viewer';
    }>(
      `SELECT a.id, a.email, a.username, a.role 
       FROM admin_sessions s
       JOIN admins a ON a.id = s.admin_id
       WHERE s.id = $1 AND s.expires_at > NOW()`,
      [sessionId]
    );

    if (rows.length > 0) {
      const user: AdminUser = {
        id: rows[0].id,
        email: rows[0].email,
        username: rows[0].username,
        role: rows[0].role,
      };
      memorySessions.set(sessionId, { user, expiresAt: Date.now() + 3600000 });
      return user;
    }
  } catch {
    // DB error
  }

  return null;
}

export async function destroySession(sessionId: string): Promise<void> {
  memorySessions.delete(sessionId);
  try {
    await query(`DELETE FROM admin_sessions WHERE id = $1`, [sessionId]);
  } catch {
    // ignore
  }
}
