import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/requireRoleMiddleware';
import { UserRole } from '@ems/shared';

const router = Router();

router.use(authMiddleware);

router.get('/dashboard', AnalyticsController.getDashboard);
router.get(
  '/admin-dashboard',
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AnalyticsController.getAdminDashboard
);

router.post(
  '/quick-student',
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AnalyticsController.createQuickStudent
);

router.post(
  '/quick-payment',
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AnalyticsController.recordQuickPayment
);

router.patch(
  '/notifications/:id/read',
  AnalyticsController.markNotificationRead
);

export const analyticsRoutes = router;
