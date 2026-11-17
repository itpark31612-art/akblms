import { describe, it, expect } from 'vitest';
import { JwtUtil } from '../src/utils/jwt';
import { UserRole } from '@ems/shared';
import { UnauthorizedError } from '../src/errors/AppError';

describe('JwtUtil Unit Tests', () => {
  const mockUser = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@ems.local',
    role: UserRole.ADMIN,
  };

  it('should generate valid access and refresh tokens', () => {
    const tokens = JwtUtil.generateTokens(mockUser);

    expect(tokens).toHaveProperty('accessToken');
    expect(tokens).toHaveProperty('refreshToken');
    expect(typeof tokens.accessToken).toBe('string');
    expect(typeof tokens.refreshToken).toBe('string');
  });

  it('should verify and decode valid accessToken', () => {
    const tokens = JwtUtil.generateTokens(mockUser);
    const decoded = JwtUtil.verifyAccessToken(tokens.accessToken);

    expect(decoded.userId).toBe(mockUser.userId);
    expect(decoded.email).toBe(mockUser.email);
    expect(decoded.role).toBe(mockUser.role);
  });

  it('should throw UnauthorizedError on invalid token', () => {
    expect(() => {
      JwtUtil.verifyAccessToken('invalid.token.signature');
    }).toThrow(UnauthorizedError);
  });
});
