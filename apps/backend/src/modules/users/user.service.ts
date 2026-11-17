import { prisma } from '../../db/prisma';
import { PasswordUtil } from '../../utils/password';
import { ConflictError, NotFoundError } from '../../errors/AppError';
import {
  ICreateUserDto,
  IUpdateUserDto,
  IUserFilterQuery,
  PaginatedResult,
  UserSummary,
  UserRole,
  UserStatus,
  UpdateUserStatusInput,
  ROLE_PERMISSIONS,
} from '@ems/shared';
import { Prisma } from '@prisma/client';
import { logger } from '../../utils/logger';

export class UserService {
  static async getUsers(query: IUserFilterQuery): Promise<PaginatedResult<UserSummary>> {
    const page = Math.max(1, Number(query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 10));
    const skip = (page - 1) * pageSize;

    const where: Prisma.UserWhereInput = {};

    if (query.role) {
      where.role = query.role as unknown as Prisma.EnumRoleFilter;
    }

    if (query.isActive !== undefined) {
      where.isActive = Boolean(query.isActive);
    }

    if (query.search) {
      const s = query.search.trim();
      where.OR = [
        { firstName: { contains: s, mode: 'insensitive' } },
        { lastName: { contains: s, mode: 'insensitive' } },
        { email: { contains: s, mode: 'insensitive' } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const items: UserSummary[] = users.map((u) => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      role: u.role as UserRole,
      status: u.status as UserStatus,
      isActive: u.isActive,
      phone: u.phone,
      avatarUrl: u.avatarUrl,
      permissions: ROLE_PERMISSIONS[u.role as UserRole] || [],
      createdAt: u.createdAt.toISOString(),
    }));

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    };
  }

  static async getUserById(id: string): Promise<UserSummary> {
    const user = await prisma.user.findUnique({
      where: { id },
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
      status: user.status as UserStatus,
      isActive: user.isActive,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      permissions: ROLE_PERMISSIONS[user.role as UserRole] || [],
      createdAt: user.createdAt.toISOString(),
    };
  }

  static async createUser(dto: ICreateUserDto): Promise<UserSummary> {
    const existing = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new ConflictError(
        'Ushbu elektron pochta manziliga ega foydalanuvchi allaqachon mavjud'
      );
    }

    const passwordHash = await PasswordUtil.hash(dto.password);

    const user = await prisma.user.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        passwordHash,
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        role: dto.role,
        phone: dto.phone?.trim(),
        status: 'ACTIVE',
        isActive: true,
      },
    });

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
      permissions: ROLE_PERMISSIONS[user.role as UserRole] || [],
      createdAt: user.createdAt.toISOString(),
    };
  }

  static async updateUser(id: string, dto: IUpdateUserDto): Promise<UserSummary> {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Foydalanuvchi topilmadi');
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        firstName: dto.firstName?.trim(),
        lastName: dto.lastName?.trim(),
        phone: dto.phone?.trim(),
        role: dto.role,
        isActive: dto.isActive,
      },
    });

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
      permissions: ROLE_PERMISSIONS[updated.role as UserRole] || [],
      createdAt: updated.createdAt.toISOString(),
    };
  }

  static async updateUserStatus(
    id: string,
    dto: UpdateUserStatusInput,
    operatorId?: string
  ): Promise<UserSummary> {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Foydalanuvchi topilmadi');
    }

    const isActive = dto.status === 'ACTIVE';

    const updated = await prisma.user.update({
      where: { id },
      data: {
        status: dto.status,
        isActive,
        // Agar blokdan chiqarilsa login limitlarini ham tiklash
        ...(isActive && { failedLoginAttempts: 0, lockedUntil: null }),
      },
    });

    // Agar bloklansa yoki to'xtatilsa, uning barcha mavjud sessiyalarini darhol bekor qilish
    if (!isActive) {
      await prisma.refreshToken.updateMany({
        where: { userId: id, revoked: false },
        data: { revoked: true },
      });
    }

    await prisma.auditLog
      .create({
        data: {
          userId: operatorId,
          action: 'USER_STATUS_CHANGE',
          resource: 'USERS',
          details: `Foydalanuvchi (${existing.email}) holati [${dto.status}] ga o‘zgartirildi. Sabab: ${dto.reason || 'Keltirilmagan'}`,
        },
      })
      .catch((err) => logger.warn('Audit log xatosi:', err));

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
      permissions: ROLE_PERMISSIONS[updated.role as UserRole] || [],
      createdAt: updated.createdAt.toISOString(),
    };
  }

  static async deleteUser(id: string): Promise<void> {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Foydalanuvchi topilmadi');
    }

    await prisma.user.delete({
      where: { id },
    });
  }
}
