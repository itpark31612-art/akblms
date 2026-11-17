import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../middlewares/validateMiddleware';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { authRateLimiter } from '../../middlewares/rateLimiter';
import { loginSchema, registerSchema, refreshTokenSchema } from '@ems/shared';

const router = Router();

router.post('/login', authRateLimiter, validateRequest(loginSchema), AuthController.login);
router.post('/register', authRateLimiter, validateRequest(registerSchema), AuthController.register);
router.post('/refresh', validateRequest(refreshTokenSchema), AuthController.refresh);
router.post('/logout', AuthController.logout);
router.get('/me', authMiddleware, AuthController.me);

export const authRoutes = router;
