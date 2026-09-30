import { Router } from 'express';
import { handleGetAdminAds, handleUpdateAdminAds } from '../controllers/settingsController.js';
import { requireAdminAuth } from '../middleware/auth.js';
import { adminApiRateLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.use(adminApiRateLimiter as any);
router.use(requireAdminAuth as any);

router.get('/', handleGetAdminAds);
router.put('/', handleUpdateAdminAds);

export default router;
