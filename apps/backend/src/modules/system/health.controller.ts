import { Request, Response } from 'express';
import { ApiResponseHelper } from '../../utils/apiResponse';
import { checkDatabaseConnection } from '../../db/prisma';

export class HealthController {
  static async check(_req: Request, res: Response): Promise<void> {
    const isDbConnected = await checkDatabaseConnection();

    const healthData = {
      status: isDbConnected ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: isDbConnected ? 'connected' : 'disconnected',
      memoryUsage: {
        rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
      },
    };

    ApiResponseHelper.success(res, healthData, 'EMS Tizim holati muvaffaqiyatli tekshirildi');
  }
}
