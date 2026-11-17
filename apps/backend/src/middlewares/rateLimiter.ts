import rateLimit from 'express-rate-limit';
import { ApiResponseHelper } from '../utils/apiResponse';

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 1000, // 15 daqiqada har bir IP dan 1000 ta so'rov
  standardHeaders: true,
  legacyHeaders: false,
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
  max: 30, // Auth uchun 30 ta urinish
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    ApiResponseHelper.error(
      res,
      429,
      'TOO_MANY_REQUESTS',
      'Xavfsizlik: Kirish urinishlari soni cheklandi. Iltimos, keyinroq urinib ko‘ring.',
      undefined,
      req.originalUrl
    );
  },
});
