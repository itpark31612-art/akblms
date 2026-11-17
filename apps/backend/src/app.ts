import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { requestLogger } from './middlewares/requestLogger';
import { errorHandler } from './middlewares/errorHandler';
import { apiRateLimiter } from './middlewares/rateLimiter';
import { healthRoutes } from './modules/system/health.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { userRoutes } from './modules/users/user.routes';
import { analyticsRoutes } from './modules/analytics/analytics.routes';
import { courseRoutes } from './modules/courses/course.routes';
import { studentRoutes } from './modules/students/student.routes';
import { ApiResponseHelper } from './utils/apiResponse';

export const createApp = (): Application => {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS
  app.use(
    cors({
      origin: [env.CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Request body and cookie parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Request logger
  app.use(requestLogger);

  // Rate Limiting
  app.use(env.API_PREFIX, apiRateLimiter);

  // API Routes
  app.use(`${env.API_PREFIX}/health`, healthRoutes);
  app.use(`${env.API_PREFIX}/auth`, authRoutes);
  app.use(`${env.API_PREFIX}/users`, userRoutes);
  app.use(`${env.API_PREFIX}/analytics`, analyticsRoutes);
  app.use(`${env.API_PREFIX}/courses`, courseRoutes);
  app.use(`${env.API_PREFIX}/students`, studentRoutes);

  // Root welcome route
  app.get('/', (_req: Request, res: Response) => {
    ApiResponseHelper.success(res, {
      name: env.APP_NAME,
      version: '1.0.0',
      apiDocs: `${env.API_PREFIX}/health`,
      status: 'active',
    });
  });

  // 404 Route Not Found
  app.use((req: Request, res: Response) => {
    ApiResponseHelper.error(
      res,
      404,
      'ROUTE_NOT_FOUND',
      `So‘ralgan manzil topilmadi: ${req.method} ${req.originalUrl}`,
      undefined,
      req.originalUrl
    );
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};
