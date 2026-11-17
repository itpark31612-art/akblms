import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';
import { ApiResponseHelper } from '../../utils/apiResponse';
import { UnauthorizedError } from '../../errors/AppError';
import { UserRole } from '@ems/shared';

export class AnalyticsController {
  static async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Avtorizatsiya talab qilinadi');
      }

      const { period, startDate, endDate } = req.query;

      if (req.user.role === UserRole.SUPER_ADMIN || req.user.role === UserRole.ADMIN) {
        const data = await AnalyticsService.getAdminDashboard({
          period: (period as any) || 'month',
          startDate: startDate as string,
          endDate: endDate as string,
        });
        ApiResponseHelper.success(res, data, 'Admin Dashboard ma’lumotlari muvaffaqiyatli olindi');
        return;
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

  static async getAdminDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Avtorizatsiya talab qilinadi');
      }

      const { period, startDate, endDate } = req.query;
      const data = await AnalyticsService.getAdminDashboard({
        period: (period as any) || 'month',
        startDate: startDate as string,
        endDate: endDate as string,
      });

      ApiResponseHelper.success(res, data, 'Admin Dashboard analitikasi muvaffaqiyatli olindi');
    } catch (error) {
      next(error);
    }
  }

  static async createQuickStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firstName, lastName, email, phone } = req.body;
      if (!firstName || !lastName || !email) {
        res.status(400).json({ success: false, message: 'Ism, familiya va email kiritilishi shart' });
        return;
      }

      const student = await AnalyticsService.createQuickStudent({
        firstName,
        lastName,
        email,
        phone,
      });

      ApiResponseHelper.success(res, student, 'Yangi o‘quvchi muvaffaqiyatli ro‘yxatga olindi', 201);
    } catch (error) {
      next(error);
    }
  }

  static async recordQuickPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { studentId, amount, paymentMethod, description } = req.body;
      if (!studentId || !amount || !paymentMethod) {
        res.status(400).json({ success: false, message: 'O‘quvchi, summa va to‘lov usuli talab qilinadi' });
        return;
      }

      const payment = await AnalyticsService.recordQuickPayment({
        studentId,
        amount: Number(amount),
        paymentMethod,
        description,
      });

      ApiResponseHelper.success(res, payment, 'To‘lov muvaffaqiyatli qabul qilindi', 201);
    } catch (error) {
      next(error);
    }
  }

  static async markNotificationRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const notification = await AnalyticsService.markNotificationRead(id);
      ApiResponseHelper.success(res, notification, 'Bildirishnoma o‘qildi');
    } catch (error) {
      next(error);
    }
  }
}
