import { Router } from 'express';
import { handleGetAdminSettings, handleUpdateAdminSettings } from '../controllers/settingsController.js';
import { requireAdminAuth } from '../middleware/auth.js';
import { adminApiRateLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.use(adminApiRateLimiter as any);
router.use(requireAdminAuth as any);

router.get('/', handleGetAdminSettings);
router.put('/', handleUpdateAdminSettings);

export default router;
