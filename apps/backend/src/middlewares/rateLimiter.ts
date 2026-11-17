import rateLimit from 'express-rate-limit';
import { ApiResponseHelper } from '../utils/apiResponse';

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 1000, // 15 daqiqada har bir IP dan 1000 ta so'rov
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  handler: (req, res) => {
    ApiResponseHelper.error(
      res,
      429,
      'TOO_MANY_REQUESTS',
      'Juda ko‘p so‘rov yuborildi. Iltimos, 15 daqiqadan so‘ng qayta urinib ko‘ring.',
      undefined,
      req.originalUrl
    );
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 30, // Auth uchun 30 ta umumiy urinish
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  handler: (req, res) => {
    ApiResponseHelper.error(
      res,
      429,
      'TOO_MANY_REQUESTS',
      'Xavfsizlik: Kirish urinishlari soni cheklandi. Iltimos, 15 daqiqadan so‘ng qayta urinib ko‘ring.',
      undefined,
      req.originalUrl
    );
  },
});

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 10, // Login uchun IP bo'yicha 10 ta urinish
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  handler: (req, res) => {
    ApiResponseHelper.error(
      res,
      429,
      'TOO_MANY_REQUESTS',
      'Xavfsizlik: Ushbu IP manzildan juda ko‘p login urinishlari amalga oshirildi. 15 daqiqadan so‘ng urinib ko‘ring.',
      undefined,
      req.originalUrl
    );
  },
});

export const passwordResetRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 5, // Parol tiklash uchun 5 ta so'rov
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  handler: (req, res) => {
    ApiResponseHelper.error(
      res,
      429,
      'TOO_MANY_REQUESTS',
      'Xavfsizlik: Parolni tiklash bo‘yicha ko‘p so‘rov yuborildi. Iltimos, keyinroq urinib ko‘ring.',
      undefined,
      req.originalUrl
    );
  },
});
