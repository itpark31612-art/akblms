import { prisma } from '../../db/prisma';
import { PasswordUtil } from '../../utils/password';
import { JwtUtil } from '../../utils/jwt';
import {
  UnauthorizedError,
  ConflictError,
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from '../../errors/AppError';
import {
  LoginInput,
  RegisterInput,
  LoginResponse,
  UserSummary,
  UserRole,
  UserStatus,
  ROLE_PERMISSIONS,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
  UpdateProfileInput,
} from '@ems/shared';
import { logger } from '../../utils/logger';

export class AuthService {
  /**
   * Tizimga kirish (Login)
   * Login urinishlarini cheklash (5 marta xato kiritilsa 15 daqiqaga hisob bloklanadi)
   * Faol va bloklangan hisoblarni tekshirish
   */
  static async login(
    input: LoginInput,
    ipAddress?: string,
    userAgent?: string
  ): Promise<LoginResponse> {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase().trim() },
    });

    if (!user) {
      throw new UnauthorizedError('Elektron pochta yoki parol noto‘g‘ri');
    }

    // 1. Vaqtinchalik bloklanganligini (Account Lockout) tekshirish
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const waitMinutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / (1000 * 60));
      throw new UnauthorizedError(
        `Xavfsizlik: Ko‘p muvaffaqiyatsiz urinish tufayli hisobingiz vaqtincha bloklandi. Iltimos, ${waitMinutes} daqiqadan so‘ng qayta urinib ko‘ring.`
      );
    }

    // 2. Doimiy bloklangan yoki nofaolligini tekshirish
    if (user.status === 'BLOCKED' || !user.isActive) {
      throw new ForbiddenError(
        'Ushbu hisob ma’muriyat tomonidan bloklangan. Tizim administratoriga murojaat qiling.'
      );
    }

    if (user.status === 'SUSPENDED') {
      throw new ForbiddenError(
        'Ushbu hisob vaqtincha to‘xtatilgan. Iltimos, ma’muriyat bilan bog‘laning.'
      );
    }

    // 3. Parolni tekshirish
    const isMatch = await PasswordUtil.compare(input.password, user.passwordHash);
    if (!isMatch) {
      const attempts = user.failedLoginAttempts + 1;
      const willLock = attempts >= 5;
      const lockedUntil = willLock ? new Date(Date.now() + 15 * 60 * 1000) : null;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: attempts,
          lockedUntil,
        },
      });

      if (willLock) {
        throw new UnauthorizedError(
          'Xavfsizlik: 5 marta xato parol kiritildi. Hisobingiz 15 daqiqaga vaqtincha bloklandi.'
        );
      }

      throw new UnauthorizedError(
        `Elektron pochta yoki parol noto‘g‘ri. Qolgan urinishlar: ${5 - attempts}`
      );
    }

    // Muvaffaqiyatli kirish: hisoblagichni tozalash
    if (user.failedLoginAttempts > 0 || user.lockedUntil) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      });
    }

    const permissions = ROLE_PERMISSIONS[user.role as UserRole] || [];

    const tokens = JwtUtil.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
      permissions,
    });

    // Refresh tokenni DB ga yozish (7 kun)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt,
        ipAddress,
        userAgent,
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
          ipAddress,
          userAgent,
        },
      })
      .catch((err) => logger.warn('Audit log xatosi:', err));

    const userSummary: UserSummary = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as UserRole,
      status: user.status as UserStatus,
      isActive: user.isActive,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      permissions,
      createdAt: user.createdAt.toISOString(),
    };

    return {
      user: userSummary,
      tokens,
    };
  }

  /**
   * Yangi foydalanuvchini ro'yxatdan o'tkazish
   */
  static async register(input: RegisterInput): Promise<LoginResponse> {
    const existing = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new ConflictError(
        'Ushbu elektron pochta manziliga ega foydalanuvchi allaqachon mavjud'
      );
    }

    const passwordHash = await PasswordUtil.hash(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase().trim(),
        passwordHash,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        role: input.role,
        phone: input.phone,
        status: 'ACTIVE',
        isActive: true,
      },
    });

    const permissions = ROLE_PERMISSIONS[user.role as UserRole] || [];

    const tokens = JwtUtil.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
      permissions,
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
      status: user.status as UserStatus,
      isActive: user.isActive,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      permissions,
      createdAt: user.createdAt.toISOString(),
    };

    return {
      user: userSummary,
      tokens,
    };
  }

  /**
   * Refresh Token Rotatsiyasi (Xavfsiz almashish va qayta ishlatilishni aniqlash)
   */
  static async refresh(refreshToken: string, ipAddress?: string, userAgent?: string) {
    JwtUtil.verifyRefreshToken(refreshToken);

    const tokenDoc = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenDoc) {
      throw new UnauthorizedError('Refresh token topilmadi');
    }

    // Agar token allaqachon bekor qilingan bo'lsa (Reuse Detection) - xavfsizlik buzilishi ehtimoli
    if (tokenDoc.revoked) {
      // Foydalanuvchining barcha sessiyalarini bekor qilish
      await prisma.refreshToken.updateMany({
        where: { userId: tokenDoc.userId, revoked: false },
        data: { revoked: true },
      });

      throw new UnauthorizedError(
        'Xavfsizlik ogohlantirishi: Token allaqachon ishlatilgan. Barcha sessiyalar xavfsizlik maqsadida bekor qilindi. Qaytadan kiring.'
      );
    }

    if (tokenDoc.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token muddati tugagan');
    }

    if (!tokenDoc.user || tokenDoc.user.status === 'BLOCKED' || !tokenDoc.user.isActive) {
      throw new ForbiddenError('Foydalanuvchi hisobi faol emas yoki bloklangan');
    }

    const permissions = ROLE_PERMISSIONS[tokenDoc.user.role as UserRole] || [];

    const newTokens = JwtUtil.generateTokens({
      userId: tokenDoc.user.id,
      email: tokenDoc.user.email,
      role: tokenDoc.user.role as UserRole,
      permissions,
    });

    // Eski tokenni bekor qilish va yangi tokenga bog'lash
    await prisma.refreshToken.update({
      where: { id: tokenDoc.id },
      data: {
        revoked: true,
        replacedByToken: newTokens.refreshToken,
      },
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: newTokens.refreshToken,
        userId: tokenDoc.user.id,
        expiresAt,
        ipAddress,
        userAgent,
      },
    });

    return newTokens;
  }

  /**
   * Tizimdan chiqish (Logout)
   */
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

  /**
   * Parolni unutganda tiklash tokeni yaratish
   */
  static async forgotPassword(
    input: ForgotPasswordInput
  ): Promise<{ message: string; resetToken?: string }> {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase().trim() },
    });

    // Xavfsizlik maqsadida foydalanuvchi mavjud bo'lmasa ham bir xil javob qaytariladi
    if (!user || !user.isActive || user.status === 'BLOCKED') {
      return {
        message: 'Agar hisob mavjud bo‘lsa, parolni tiklash bo‘yicha ko‘rsatma yuborildi.',
      };
    }

    // 1 soat amal qiluvchi tiklash tokeni
    const token = JwtUtil.generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Oldingi foydalanilmagan tokenlarni bekor qilish
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    await prisma.auditLog
      .create({
        data: {
          userId: user.id,
          userEmail: user.email,
          userRole: user.role,
          action: 'AUTH_FORGOT_PASSWORD',
          resource: 'AUTH',
          details: 'Parolni tiklash so‘rovi yuborildi',
        },
      })
      .catch((err) => logger.warn('Audit log xatosi:', err));

    return {
      message: 'Parolni tiklash havolasi yuborildi.',
      resetToken: process.env.NODE_ENV !== 'production' ? token : undefined,
    };
  }

  /**
   * Parolni tiklash (Reset Password)
   */
  static async resetPassword(input: ResetPasswordInput): Promise<void> {
    const resetDoc = await prisma.passwordResetToken.findUnique({
      where: { token: input.token },
      include: { user: true },
    });

    if (!resetDoc || resetDoc.used || resetDoc.expiresAt < new Date()) {
      throw new BadRequestError('Tiklash kodi yaroqsiz yoki muddati o‘tgan');
    }

    const passwordHash = await PasswordUtil.hash(input.newPassword);

    // Parolni yangilash va blokdan chiqarish
    await prisma.user.update({
      where: { id: resetDoc.userId },
      data: {
        passwordHash,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    // Ishlatilgan deb belgilash
    await prisma.passwordResetToken.update({
      where: { id: resetDoc.id },
      data: { used: true },
    });

    // Xavfsizlik uchun foydalanuvchining barcha sessiyalarini bekor qilish
    await prisma.refreshToken.updateMany({
      where: { userId: resetDoc.userId, revoked: false },
      data: { revoked: true },
    });

    await prisma.auditLog
      .create({
        data: {
          userId: resetDoc.userId,
          userEmail: resetDoc.user.email,
          userRole: resetDoc.user.role,
          action: 'AUTH_RESET_PASSWORD',
          resource: 'AUTH',
          details: 'Parol muvaffaqiyatli tiklandi',
        },
      })
      .catch((err) => logger.warn('Audit log xatosi:', err));
  }

  /**
   * Profil ichidan parolni o'zgartirish
   */
  static async changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('Foydalanuvchi topilmadi');
    }

    const isMatch = await PasswordUtil.compare(input.currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestError('Joriy parol noto‘g‘ri kiritildi');
    }

    const newPasswordHash = await PasswordUtil.hash(input.newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    // Boshqa barcha qurilmalardagi sessiyalarni bekor qilish
    await prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });

    await prisma.auditLog
      .create({
        data: {
          userId,
          userEmail: user.email,
          userRole: user.role,
          action: 'AUTH_CHANGE_PASSWORD',
          resource: 'AUTH',
          details: 'Parol profil orqali yangilandi',
        },
      })
      .catch((err) => logger.warn('Audit log xatosi:', err));
  }

  /**
   * Profil ma'lumotlarini yangilash
   */
  static async updateProfile(userId: string, input: UpdateProfileInput): Promise<UserSummary> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('Foydalanuvchi topilmadi');
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(input.firstName && { firstName: input.firstName.trim() }),
        ...(input.lastName && { lastName: input.lastName.trim() }),
        ...(input.phone !== undefined && { phone: input.phone?.trim() }),
        ...(input.avatarUrl !== undefined && { avatarUrl: input.avatarUrl?.trim() }),
      },
    });

    const permissions = ROLE_PERMISSIONS[updated.role as UserRole] || [];

    return {
      id: updated.id,
      email: updated.email,
      firstName: updated.firstName,
      lastName: updated.lastName,
      role: updated.role as UserRole,
      status: updated.status as UserStatus,
      isActive: updated.isActive,
      phone: updated.phone,
      avatarUrl: updated.avatarUrl,
      permissions,
      createdAt: updated.createdAt.toISOString(),
    };
  }

  /**
   * Joriy foydalanuvchi profil ma'lumotlarini olish (Me)
   */
  static async getMe(userId: string): Promise<UserSummary> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('Foydalanuvchi topilmadi');
    }

    const permissions = ROLE_PERMISSIONS[user.role as UserRole] || [];

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as UserRole,
      status: user.status as UserStatus,
      isActive: user.isActive,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      permissions,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
