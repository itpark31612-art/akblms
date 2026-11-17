import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';
import { TokenPayload, AuthTokens, UserRole, ROLE_PERMISSIONS } from '@ems/shared';
import { UnauthorizedError } from '../errors/AppError';

export class JwtUtil {
  static generateTokens(payload: {
    userId: string;
    email: string;
    role: UserRole;
    permissions?: string[];
  }): AuthTokens {
    const accessOptions: SignOptions = {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as unknown as number,
    };
    const refreshOptions: SignOptions = {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as unknown as number,
    };

    const permissions = payload.permissions || ROLE_PERMISSIONS[payload.role] || [];

    const fullPayload: TokenPayload = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      permissions,
    };

    const accessToken = jwt.sign(fullPayload, env.JWT_ACCESS_SECRET, accessOptions);
    const refreshToken = jwt.sign(
      {
        userId: payload.userId,
        role: payload.role,
        jti: crypto.randomUUID(),
      },
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

  static generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
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

  static verifyRefreshToken(token: string): { userId: string; role: UserRole; jti?: string } {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET) as {
        userId: string;
        role: UserRole;
        jti?: string;
      };
    } catch (err: unknown) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Refresh token muddati tugagan');
      }
      throw new UnauthorizedError('Refresh token noto‘g‘ri yoki yaroqsiz');
    }
  }
}
