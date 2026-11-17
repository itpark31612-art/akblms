import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';
import { ApiResponseHelper } from '../../utils/apiResponse';
import { UnauthorizedError } from '../../errors/AppError';

export class AnalyticsController {
  static async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Avtorizatsiya talab qilinadi');
      }

      const data = await AnalyticsService.getDashboardAnalytics({
        userId: req.user.userId,
        role: req.user.role,
      });

      ApiResponseHelper.success(res, data, 'Analitika ma’lumotlari muvaffaqiyatli olindi');
    } catch (error) {
      next(error);
    }
  }
}
