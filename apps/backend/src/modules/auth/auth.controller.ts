import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { ApiResponseHelper } from '../../utils/apiResponse';
import { UnauthorizedError } from '../../errors/AppError';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);

      // Refresh tokenni secure cookie da saqlash (browser uchun)
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      ApiResponseHelper.success(res, result, 'Tizimga muvaffaqiyatli kirildi');
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body);

      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      ApiResponseHelper.created(res, result, 'Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tkazildi');
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.body.refreshToken || req.cookies?.refreshToken;
      if (!token) {
        throw new UnauthorizedError('Refresh token taqdim etilmadi');
      }

      const result = await AuthService.refresh(token);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      ApiResponseHelper.success(res, result, 'Token muvaffaqiyatli yangilandi');
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.body.refreshToken || req.cookies?.refreshToken;
      const userId = req.user?.userId;

      await AuthService.logout(token, userId);

      res.clearCookie('refreshToken');
      ApiResponseHelper.success(res, null, 'Tizimdan muvaffaqiyatli chiqildi');
    } catch (error) {
      next(error);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Foydalanuvchi aniqlanmadi');
      }

      const user = await AuthService.getMe(req.user.userId);
      ApiResponseHelper.success(res, user, 'Foydalanuvchi ma’lumotlari muvaffaqiyatli olindi');
    } catch (error) {
      next(error);
    }
  }
}
