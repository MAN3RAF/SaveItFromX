import dotenv from 'dotenv';
dotenv.config();

export interface BackendConfig {
  nodeEnv: 'development' | 'production' | 'test';
  port: number;
  host: string;
  databaseUrl: string;
  sessionSecret: string;
  initialAdminEmail: string;
  initialAdminPassword?: string;
  allowedOrigins: string[];
  downloadTimeoutMs: number;
  maxConcurrentDownloads: number;
  tempDir: string;
}

const nodeEnv = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test';
const port = parseInt(process.env.PORT || '3000', 10);
const host = '0.0.0.0';
const databaseUrl = process.env.DATABASE_URL || '';
const sessionSecret = process.env.SESSION_SECRET || 'dev-secret-saveitfromx-change-in-production-min32chars';
const initialAdminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@saveitfromx.com';
const initialAdminPassword = process.env.INITIAL_ADMIN_PASSWORD;

const isProd = nodeEnv === 'production';
const rawOrigins = process.env.ALLOWED_ORIGINS || '';
const parsedEnvOrigins = rawOrigins
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

// In production: Strictly use exact configured origins from ALLOWED_ORIGINS
// In development: Include local development servers
const allowedOrigins = isProd
  ? parsedEnvOrigins
  : Array.from(
      new Set([
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        ...parsedEnvOrigins,
      ])
    );

const downloadTimeoutMs = parseInt(process.env.DOWNLOAD_TIMEOUT_MS || '60000', 10);
const maxConcurrentDownloads = parseInt(process.env.MAX_CONCURRENT_DOWNLOADS || '3', 10);
const tempDir = process.env.TEMP_DIR || '/tmp/saveitfromx';

export const config: BackendConfig = {
  nodeEnv,
  port: isNaN(port) ? 3000 : port,
  host,
  databaseUrl,
  sessionSecret,
  initialAdminEmail,
  initialAdminPassword,
  allowedOrigins,
  downloadTimeoutMs,
  maxConcurrentDownloads,
  tempDir,
};

/**
 * Validate runtime secrets on startup to fail-fast on insecure or missing configurations in production
 */
export function validateStartupConfig(cfg: BackendConfig = config): void {
  if (cfg.nodeEnv === 'production') {
    const secret = process.env.SESSION_SECRET;
    if (!secret || secret.length < 32 || secret.includes('change-this') || secret.includes('dev-secret')) {
      throw new Error(
        '[Startup Security Error]: SESSION_SECRET must be set and contain at least 32 characters in production. Refusing to start.'
      );
    }
  }
}

// Execute startup validation
validateStartupConfig(config);
