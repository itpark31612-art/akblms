import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { ApiResponseHelper } from '../../utils/apiResponse';

export class UserController {
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await UserService.getUsers(req.query);
      ApiResponseHelper.paginated(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.getUserById(req.params.id);
      ApiResponseHelper.success(res, user);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.createUser(req.body);
      ApiResponseHelper.created(res, user, 'Yangi foydalanuvchi muvaffaqiyatli yaratildi');
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      ApiResponseHelper.success(res, user, 'Foydalanuvchi ma’lumotlari yangilandi');
    } catch (error) {
      next(error);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await UserService.deleteUser(req.params.id);
      ApiResponseHelper.success(res, null, 'Foydalanuvchi muvaffaqiyatli o‘chirildi');
    } catch (error) {
      next(error);
    }
  }
}
