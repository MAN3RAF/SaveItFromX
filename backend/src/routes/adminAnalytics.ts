import { Router } from 'express';
import {
  handleGetAnalyticsSummary,
  handleGetDownloadLogs,
  handleExportCsv,
} from '../controllers/analyticsController.js';
import { requireAdminAuth } from '../middleware/auth.js';
import { adminApiRateLimiter } from '../middleware/rateLimit.js';

const router = Router();

// Strict security: ALL routes in this file require administrator authentication & rate limiting
router.use(adminApiRateLimiter as any);
router.use(requireAdminAuth as any);

router.get('/summary', handleGetAnalyticsSummary);
router.get('/downloads', handleGetDownloadLogs);
router.get('/export-csv', handleExportCsv);

export default router;
