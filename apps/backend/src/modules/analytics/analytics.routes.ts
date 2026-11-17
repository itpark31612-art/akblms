import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/dashboard', AnalyticsController.getDashboard);

export const analyticsRoutes = router;
