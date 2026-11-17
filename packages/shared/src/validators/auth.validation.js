'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.createCourseSchema =
  exports.updateUserSchema =
  exports.refreshTokenSchema =
  exports.registerSchema =
  exports.loginSchema =
    void 0;
const zod_1 = require('zod');
const roles_1 = require('../constants/roles');
exports.loginSchema = zod_1.z.object({
  email: zod_1.z.string().trim().email({ message: 'To‘g‘ri elektron pochta manzilini kiriting' }),
  password: zod_1.z
    .string()
    .min(6, { message: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak' })
    .max(100, { message: 'Parol 100 ta belgidan oshmasligi kerak' }),
});
exports.registerSchema = zod_1.z.object({
  email: zod_1.z.string().trim().email({ message: 'To‘g‘ri elektron pochta manzilini kiriting' }),
  password: zod_1.z
    .string()
    .min(6, { message: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak' }),
  firstName: zod_1.z
    .string()
    .trim()
    .min(2, { message: 'Ism kamida 2 ta belgidan iborat bo‘lishi kerak' }),
  lastName: zod_1.z
    .string()
    .trim()
    .min(2, { message: 'Familiya kamida 2 ta belgidan iborat bo‘lishi kerak' }),
  role: zod_1.z.nativeEnum(roles_1.UserRole, {
    errorMap: () => ({ message: 'Noto‘g‘ri foydalanuvchi roli tanlandi' }),
  }),
  phone: zod_1.z.string().trim().optional(),
});
exports.refreshTokenSchema = zod_1.z.object({
  refreshToken: zod_1.z.string().min(1, { message: 'Refresh token taqdim etilishi shart' }),
});
exports.updateUserSchema = zod_1.z.object({
  firstName: zod_1.z.string().trim().min(2).optional(),
  lastName: zod_1.z.string().trim().min(2).optional(),
  phone: zod_1.z.string().trim().optional(),
  role: zod_1.z.nativeEnum(roles_1.UserRole).optional(),
  isActive: zod_1.z.boolean().optional(),
});
exports.createCourseSchema = zod_1.z.object({
  code: zod_1.z.string().trim().min(2, { message: 'Kurs kodi kamida 2 belgi bo‘lishi kerak' }),
  title: zod_1.z.string().trim().min(3, { message: 'Kurs nomi kamida 3 belgi bo‘lishi kerak' }),
  description: zod_1.z.string().trim().optional(),
  credits: zod_1.z.number().int().min(1).max(10).default(3),
  teacherId: zod_1.z.string().uuid().optional(),
});
//# sourceMappingURL=auth.validation.js.map
