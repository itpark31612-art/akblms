import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@ems/shared';
import { ForbiddenError, UnauthorizedError } from '../errors/AppError';

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Avtorizatsiyadan o‘tmagan foydalanuvchi');
    }

    // Super Admin har doim ruxsatga ega
    if (req.user.role === UserRole.SUPER_ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Ushbu amal faqat [${allowedRoles.join(', ')}] rollari uchun ruxsat etilgan. Sizning rolingiz: ${req.user.role}`
      );
    }

    next();
  };
};
