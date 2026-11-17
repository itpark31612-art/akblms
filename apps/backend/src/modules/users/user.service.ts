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
} from '@ems/shared';
import { Prisma } from '@prisma/client';

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
      isActive: u.isActive,
      phone: u.phone,
      avatarUrl: u.avatarUrl,
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
      isActive: user.isActive,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
    };
  }

  static async createUser(dto: ICreateUserDto): Promise<UserSummary> {
    const existing = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictError(
        'Ushbu elektron pochta manziliga ega foydalanuvchi allaqachon mavjud'
      );
    }

    const passwordHash = await PasswordUtil.hash(dto.password);

    const user = await prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role,
        phone: dto.phone,
        isActive: true,
      },
    });

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

  static async updateUser(id: string, dto: IUpdateUserDto): Promise<UserSummary> {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Foydalanuvchi topilmadi');
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
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
      isActive: updated.isActive,
      phone: updated.phone,
      avatarUrl: updated.avatarUrl,
      createdAt: updated.createdAt.toISOString(),
    };
  }

  static async deleteUser(id: string): Promise<void> {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Foydalanuvchi topilmadi');
    }

    // Soft delete or hard delete
    await prisma.user.delete({
      where: { id },
    });
  }
}
