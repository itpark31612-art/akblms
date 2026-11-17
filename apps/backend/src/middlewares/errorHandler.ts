import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { ApiResponseHelper } from '../utils/apiResponse';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // 1. Agar AppError bo'lsa
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(`[AppError ${err.statusCode}] ${err.message}`, {
        path: req.originalUrl,
        method: req.method,
        details: err.details,
        stack: err.stack,
      });
    } else {
      logger.warn(`[ClientError ${err.statusCode}] ${err.message}`, {
        path: req.originalUrl,
        method: req.method,
        details: err.details,
      });
    }

    ApiResponseHelper.error(
      res,
      err.statusCode,
      err.code,
      err.message,
      err.details,
      req.originalUrl
    );
    return;
  }

  // 2. Agar Zod validation xatosi bo'lsa
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
      code: e.code,
    }));

    logger.warn(`[ValidationError] Validation failed on ${req.method} ${req.originalUrl}`, {
      errors: formattedErrors,
    });

    ApiResponseHelper.error(
      res,
      422,
      'VALIDATION_ERROR',
      'Yuborilgan ma’lumotlar formati noto‘g‘ri',
      formattedErrors,
      req.originalUrl
    );
    return;
  }

  // 3. Prisma yoki boshqa kutilmagan ichki xatolar
  logger.error(`[UnhandledError] ${err.message}`, {
    path: req.originalUrl,
    method: req.method,
    stack: err.stack,
  });

  const message =
    process.env.NODE_ENV === 'production'
      ? 'Ichki tizim xatoligi yuz berdi. Iltimos keyinroq qayta urinib ko‘ring.'
      : err.message || 'Kutilmagan ichki xatolik yuz berdi';

  ApiResponseHelper.error(
    res,
    500,
    'INTERNAL_SERVER_ERROR',
    message,
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : undefined,
    req.originalUrl
  );
};
