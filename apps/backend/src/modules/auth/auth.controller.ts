import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { ApiResponseHelper } from '../../utils/apiResponse';
import { UnauthorizedError } from '../../errors/AppError';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await AuthService.login(req.body, ipAddress, userAgent);

      // Refresh tokenni secure HTTP-only cookie da saqlash
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 kun
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

      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await AuthService.refresh(token, ipAddress, userAgent);

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

  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.forgotPassword(req.body);
      ApiResponseHelper.success(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await AuthService.resetPassword(req.body);
      ApiResponseHelper.success(
        res,
        null,
        'Parol muvaffaqiyatli yangilandi. Yangi parol bilan tizimga kiring.'
      );
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Avtorizatsiya talab qilinadi');
      }

      await AuthService.changePassword(req.user.userId, req.body);
      ApiResponseHelper.success(res, null, 'Parol muvaffaqiyatli o‘zgartirildi');
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Avtorizatsiya talab qilinadi');
      }

      const updated = await AuthService.updateProfile(req.user.userId, req.body);
      ApiResponseHelper.success(res, updated, 'Profil ma’lumotlari muvaffaqiyatli yangilandi');
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
