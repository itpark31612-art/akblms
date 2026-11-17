import { z } from 'zod';
import { UserRole } from '../constants/roles';

export const loginSchema = z.object({
  email: z.string().trim().email({ message: 'To‘g‘ri elektron pochta manzilini kiriting' }),
  password: z
    .string()
    .min(6, { message: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak' })
    .max(100, { message: 'Parol 100 ta belgidan oshmasligi kerak' }),
});

export const registerSchema = z.object({
  email: z.string().trim().email({ message: 'To‘g‘ri elektron pochta manzilini kiriting' }),
  password: z.string().min(6, { message: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak' }),
  firstName: z
    .string()
    .trim()
    .min(2, { message: 'Ism kamida 2 ta belgidan iborat bo‘lishi kerak' }),
  lastName: z
    .string()
    .trim()
    .min(2, { message: 'Familiya kamida 2 ta belgidan iborat bo‘lishi kerak' }),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: 'Noto‘g‘ri foydalanuvchi roli tanlandi' }),
  }),
  phone: z.string().trim().optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, { message: 'Refresh token taqdim etilishi shart' }),
});

export const updateUserSchema = z.object({
  firstName: z.string().trim().min(2).optional(),
  lastName: z.string().trim().min(2).optional(),
  phone: z.string().trim().optional(),
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
});

export const createCourseSchema = z.object({
  code: z.string().trim().min(2, { message: 'Kurs kodi kamida 2 belgi bo‘lishi kerak' }),
  title: z.string().trim().min(3, { message: 'Kurs nomi kamida 3 belgi bo‘lishi kerak' }),
  description: z.string().trim().optional(),
  credits: z.number().int().min(1).max(10).default(3),
  teacherId: z.string().uuid().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
