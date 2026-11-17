import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/requireRoleMiddleware';
import { requirePermission } from '../../middlewares/requirePermissionMiddleware';
import { validateRequest } from '../../middlewares/validateMiddleware';
import {
  UserRole,
  AppPermission,
  registerSchema,
  updateUserSchema,
  updateUserStatusSchema,
} from '@ems/shared';

const router = Router();

// Barcha user route lari avtorizatsiya talab qiladi
router.use(authMiddleware);

// Ro'yxatni ko'rish (Super Admin, Admin va O'qituvchi)
router.get('/', requireRole(UserRole.ADMIN, UserRole.TEACHER), UserController.list);

// Bitta foydalanuvchini ko'rish
router.get('/:id', requireRole(UserRole.ADMIN, UserRole.TEACHER), UserController.getById);

// Yangi foydalanuvchi yaratish (Faqat Admin / Super Admin)
router.post(
  '/',
  requireRole(UserRole.ADMIN),
  validateRequest(registerSchema),
  UserController.create
);

// Foydalanuvchi ma'lumotlarini yangilash
router.put(
  '/:id',
  requireRole(UserRole.ADMIN),
  validateRequest(updateUserSchema),
  UserController.update
);

// Foydalanuvchi holatini o'zgartirish (Bloklash / Faollashtirish)
router.patch(
  '/:id/status',
  requirePermission(AppPermission.USERS_STATUS),
  validateRequest(updateUserStatusSchema),
  UserController.updateStatus
);

// Foydalanuvchini butunlay o'chirish (Super Admin yoki Maktab Admini)
router.delete('/:id', requireRole(UserRole.ADMIN), UserController.remove);

export const userRoutes = router;
