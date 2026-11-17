import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { TokenPayload, AuthTokens, UserRole } from '@ems/shared';
import { UnauthorizedError } from '../errors/AppError';

export class JwtUtil {
  static generateTokens(payload: { userId: string; email: string; role: UserRole }): AuthTokens {
    const accessOptions: SignOptions = {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as unknown as number,
    };
    const refreshOptions: SignOptions = {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as unknown as number,
    };

    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, accessOptions);
    const refreshToken = jwt.sign(
      { userId: payload.userId, role: payload.role },
      env.JWT_REFRESH_SECRET,
      refreshOptions
    );

    // Approximate expiry in seconds (15m = 900s)
    const expiresIn = 15 * 60;

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
    } catch (err: unknown) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Access token muddati tugagan', { expiredAt: err.expiredAt });
      }
      throw new UnauthorizedError('Access token noto‘g‘ri yoki yaroqsiz');
    }
  }

  static verifyRefreshToken(token: string): { userId: string; role: UserRole } {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string; role: UserRole };
    } catch (err: unknown) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Refresh token muddati tugagan');
      }
      throw new UnauthorizedError('Refresh token noto‘g‘ri yoki yaroqsiz');
    }
  }
}
