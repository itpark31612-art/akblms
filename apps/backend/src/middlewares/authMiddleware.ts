import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt';
import { UnauthorizedError } from '../errors/AppError';
import { TokenPayload } from '@ems/shared';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Avtorizatsiya sarlavhasi (Bearer token) topilmadi');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new UnauthorizedError('Token formati noto‘g‘ri');
  }

  const payload = JwtUtil.verifyAccessToken(token);
  req.user = payload;
  next();
};
