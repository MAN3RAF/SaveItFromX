import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/index.js';
import { sitemapService } from './services/seo/sitemapService.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import healthRoutes from './routes/health.js';
import mediaRoutes from './routes/media.js';
import publicRoutes from './routes/public.js';
import adminAuthRoutes from './routes/adminAuth.js';
import adminSettingsRoutes from './routes/adminSettings.js';
import adminAdsRoutes from './routes/adminAds.js';
import adminAnalyticsRoutes from './routes/adminAnalytics.js';

export function createBackendApp() {
  const app = express();

  // 1. Security & Parsing Middleware
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows flexible cross-domain API operation
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  app.use(
    cors({
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
        if (!origin) {
          callback(null, true);
          return;
        }

        // Exact origin match against configured ALLOWED_ORIGINS
        if (config.allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        // Allow localhost development servers strictly in non-production
        if (config.nodeEnv !== 'production') {
          if (/^http:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/.test(origin)) {
            callback(null, true);
            return;
          }
        }

        callback(null, false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    })
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());

  // 2. Crawler Endpoints
  app.get('/robots.txt', (_req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(sitemapService.generateRobotsTxt());
  });

  app.get('/sitemap.xml', (_req, res) => {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(sitemapService.generateSitemapIndexXml());
  });

  app.get('/sitemap_:id.xml', (req, res) => {
    const sitemapNumber = parseInt(req.params.id, 10);
    if (isNaN(sitemapNumber) || sitemapNumber < 1) {
      res.status(404).send('Not Found');
      return;
    }
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(sitemapService.generateSubSitemapXml(sitemapNumber));
  });

  // 3. API Routes
  app.use('/api/health', healthRoutes);
  app.use('/api/media', mediaRoutes);
  app.use('/api/public', publicRoutes);
  app.use('/api/admin/auth', adminAuthRoutes);
  app.use('/api/admin/settings', adminSettingsRoutes);
  app.use('/api/admin/ads', adminAdsRoutes);
  app.use('/api/admin/analytics', adminAnalyticsRoutes);

  // 4. Centralized Error Handler
  app.use(errorHandler);

  return app;
}

const app = createBackendApp();

const server = app.listen(config.port, config.host, () => {
  console.log(`[SaveItFromX Backend] Running on http://${config.host}:${config.port} [Mode: ${config.nodeEnv}]`);
});

// Graceful Shutdown
function shutdown(signal: string) {
  console.log(`[SaveItFromX Backend] Received ${signal}. Shutting down cleanly...`);
  server.close(() => {
    console.log('[SaveItFromX Backend] HTTP server closed.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('[SaveItFromX Backend] Forced exit after timeout.');
    process.exit(1);
  }, 5000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
