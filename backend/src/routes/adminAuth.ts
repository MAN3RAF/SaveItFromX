import { Router } from 'express';
import { handleAdminLogin, handleAdminLogout, handleAdminMe } from '../controllers/authController.js';
import { requireAdminAuth } from '../middleware/auth.js';
import { adminLoginRateLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/login', adminLoginRateLimiter, handleAdminLogin);
router.post('/logout', handleAdminLogout);
router.get('/me', requireAdminAuth as any, handleAdminMe as any);

export default router;
