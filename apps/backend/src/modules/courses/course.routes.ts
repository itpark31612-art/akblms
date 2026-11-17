import { Router } from 'express';
import { CourseController } from './course.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/requireRoleMiddleware';
import { validateRequest } from '../../middlewares/validateMiddleware';
import { UserRole, createCourseSchema } from '@ems/shared';

const router = Router();

router.use(authMiddleware);

// Kurslarni ko'rish barcha autentifikatsiyalangan foydalanuvchilar uchun
router.get('/', CourseController.list);
router.get('/:id', CourseController.getById);

// Kurslarni yaratish, tahrirlash va o'chirish: Admin va Super Admin uchun
router.post(
  '/',
  requireRole(UserRole.ADMIN, UserRole.TEACHER),
  validateRequest(createCourseSchema),
  CourseController.create
);
router.put('/:id', requireRole(UserRole.ADMIN, UserRole.TEACHER), CourseController.update);
router.delete('/:id', requireRole(UserRole.ADMIN), CourseController.remove);

export const courseRoutes = router;
