import { prisma } from '../../db/prisma';
import { PasswordUtil } from '../../utils/password';
import { JwtUtil } from '../../utils/jwt';
import { UnauthorizedError, ConflictError, NotFoundError } from '../../errors/AppError';
import { LoginInput, RegisterInput, LoginResponse, UserSummary, UserRole } from '@ems/shared';
import { logger } from '../../utils/logger';

export class AuthService {
  static async login(input: LoginInput): Promise<LoginResponse> {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedError('Elektron pochta yoki parol noto‘g‘ri');
    }

    if (!user.isActive) {
      throw new UnauthorizedError(
        'Ushbu foydalanuvchi hisobi faol emas. Ma’muriyatga murojaat qiling.'
      );
    }

    const isMatch = await PasswordUtil.compare(input.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Elektron pochta yoki parol noto‘g‘ri');
    }

    const tokens = JwtUtil.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    // Store refresh token in database (7 days expiration)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Audit log
    await prisma.auditLog
      .create({
        data: {
          userId: user.id,
          userEmail: user.email,
          userRole: user.role,
          action: 'AUTH_LOGIN',
          resource: 'AUTH',
          details: 'Foydalanuvchi tizimga kirdi',
        },
      })
      .catch((err) => logger.warn('Failed to save audit log:', err));

    const userSummary: UserSummary = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as UserRole,
      isActive: user.isActive,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
    };

    return {
      user: userSummary,
      tokens,
    };
  }

  static async register(input: RegisterInput): Promise<LoginResponse> {
    const existing = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictError(
        'Ushbu elektron pochta manziliga ega foydalanuvchi allaqachon mavjud'
      );
    }

    const passwordHash = await PasswordUtil.hash(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        role: input.role,
        phone: input.phone,
        isActive: true,
      },
    });

    const tokens = JwtUtil.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    const userSummary: UserSummary = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as UserRole,
      isActive: user.isActive,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
    };

    return {
      user: userSummary,
      tokens,
    };
  }

  static async refresh(refreshToken: string) {
    JwtUtil.verifyRefreshToken(refreshToken);

    const tokenDoc = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenDoc || tokenDoc.revoked || tokenDoc.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token bekor qilingan yoki muddati tugagan');
    }

    if (!tokenDoc.user || !tokenDoc.user.isActive) {
      throw new UnauthorizedError('Foydalanuvchi hisobi faol emas');
    }

    // Revoke old token and issue new pair (Token Rotation)
    await prisma.refreshToken.update({
      where: { id: tokenDoc.id },
      data: { revoked: true },
    });

    const newTokens = JwtUtil.generateTokens({
      userId: tokenDoc.user.id,
      email: tokenDoc.user.email,
      role: tokenDoc.user.role as UserRole,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: newTokens.refreshToken,
        userId: tokenDoc.user.id,
        expiresAt,
      },
    });

    return newTokens;
  }

  static async logout(refreshToken?: string, userId?: string): Promise<void> {
    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { revoked: true },
      });
    } else if (userId) {
      await prisma.refreshToken.updateMany({
        where: { userId, revoked: false },
        data: { revoked: true },
      });
    }
  }

  static async getMe(userId: string): Promise<UserSummary> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('Foydalanuvchi topilmadi');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as UserRole,
      isActive: user.isActive,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
