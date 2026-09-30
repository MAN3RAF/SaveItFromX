import { Router } from 'express';
import { handleGetPublicSettings } from '../controllers/settingsController.js';
import { handleLogDownloadEvent } from '../controllers/analyticsController.js';
import { seoService } from '../services/seo/seoService.js';
import { infoRateLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.get('/settings', handleGetPublicSettings);
router.post('/log', infoRateLimiter, handleLogDownloadEvent);

router.get('/seo/page/:slug', (req, res) => {
  const page = seoService.getPageBySlug(req.params.slug);
  res.json(page);
});

export default router;
