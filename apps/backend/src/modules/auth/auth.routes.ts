import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../middlewares/validateMiddleware';
import { authMiddleware } from '../../middlewares/authMiddleware';
import {
  authRateLimiter,
  loginRateLimiter,
  passwordResetRateLimiter,
} from '../../middlewares/rateLimiter';
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
} from '@ems/shared';

const router = Router();

// Public auth endpoints
router.post('/login', loginRateLimiter, validateRequest(loginSchema), AuthController.login);
router.post('/register', authRateLimiter, validateRequest(registerSchema), AuthController.register);
router.post('/refresh', validateRequest(refreshTokenSchema), AuthController.refresh);
router.post(
  '/forgot-password',
  passwordResetRateLimiter,
  validateRequest(forgotPasswordSchema),
  AuthController.forgotPassword
);
router.post(
  '/reset-password',
  passwordResetRateLimiter,
  validateRequest(resetPasswordSchema),
  AuthController.resetPassword
);

// Protected auth endpoints
router.post('/logout', AuthController.logout);
router.get('/me', authMiddleware, AuthController.me);
router.put(
  '/profile',
  authMiddleware,
  validateRequest(updateProfileSchema),
  AuthController.updateProfile
);
router.put(
  '/change-password',
  authMiddleware,
  validateRequest(changePasswordSchema),
  AuthController.changePassword
);

export const authRoutes = router;
