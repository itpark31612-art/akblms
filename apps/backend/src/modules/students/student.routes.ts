import { Router } from 'express';
import { StudentController } from './student.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/requireRoleMiddleware';
import { UserRole } from '@ems/shared';

const router = Router();

router.use(authMiddleware);

// Guruhlar ro'yxati (filtrlash uchun)
router.get('/classrooms', StudentController.getClassRooms);

// O'quvchilar ro'yxati
router.get(
  '/',
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER),
  StudentController.list
);

// Bitta o'quvchi profili
router.get(
  '/:id',
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER, UserRole.PARENT, UserRole.STUDENT),
  StudentController.getProfile
);

// O'quvchi qo'shish
router.post(
  '/',
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  StudentController.create
);

// O'quvchini tahrirlash
router.put(
  '/:id',
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  StudentController.update
);

// O'quvchini arxivlash yoki qayta tiklash
router.patch(
  '/:id/archive',
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  StudentController.archive
);

// O'quvchini o'chirish
router.delete(
  '/:id',
  requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  StudentController.delete
);

export const studentRoutes = router;
