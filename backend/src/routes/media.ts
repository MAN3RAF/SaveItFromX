import { Router } from 'express';
import { handleGetMediaInfo, handleDownloadMedia } from '../controllers/mediaController.js';
import { infoRateLimiter, downloadRateLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/info', infoRateLimiter, handleGetMediaInfo);
router.get('/download', downloadRateLimiter, handleDownloadMedia);
router.post('/download', downloadRateLimiter, handleDownloadMedia);

export default router;
