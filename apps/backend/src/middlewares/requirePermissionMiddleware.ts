import { Request, Response, NextFunction } from 'express';
import { UserRole, hasRolePermission } from '@ems/shared';
import { ForbiddenError, UnauthorizedError } from '../errors/AppError';

export const requirePermission = (...requiredPermissions: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Avtorizatsiyadan o‘tmagan foydalanuvchi');
    }

    if (req.user.role === UserRole.SUPER_ADMIN) {
      return next();
    }

    const userPermissions = req.user.permissions || [];

    const hasAll = requiredPermissions.every((perm) => {
      if (userPermissions.includes('*') || userPermissions.includes(perm)) {
        return true;
      }
      return hasRolePermission(req.user!.role, perm);
    });

    if (!hasAll) {
      throw new ForbiddenError(
        `Sizda ushbu amalni bajarish uchun yetarli ruxsat yo‘q: [${requiredPermissions.join(', ')}]`
      );
    }

    next();
  };
};
