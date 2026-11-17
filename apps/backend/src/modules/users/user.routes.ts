import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/requireRoleMiddleware';
import { validateRequest } from '../../middlewares/validateMiddleware';
import { UserRole, registerSchema, updateUserSchema } from '@ems/shared';

const router = Router();

// Barcha user route lari avtorizatsiya talab qiladi
router.use(authMiddleware);

// Faqat Super Admin va Admin userlarni ko'ra oladi va boshqara oladi
router.get('/', requireRole(UserRole.ADMIN, UserRole.TEACHER), UserController.list);
router.get('/:id', requireRole(UserRole.ADMIN, UserRole.TEACHER), UserController.getById);
router.post(
  '/',
  requireRole(UserRole.ADMIN),
  validateRequest(registerSchema),
  UserController.create
);
router.put(
  '/:id',
  requireRole(UserRole.ADMIN),
  validateRequest(updateUserSchema),
  UserController.update
);
router.delete('/:id', requireRole(UserRole.ADMIN), UserController.remove);

export const userRoutes = router;
