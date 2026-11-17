import { Request, Response, NextFunction } from 'express';
import { StudentService } from './student.service';
import { ApiResponseHelper } from '../../utils/apiResponse';
import { BadRequestError } from '../../errors/AppError';

export class StudentController {
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, status, classRoomId, page, pageSize } = req.query;
      const result = await StudentService.getStudents({
        search: search as string,
        status: status as string,
        classRoomId: classRoomId as string,
        page: page ? Number(page) : 1,
        pageSize: pageSize ? Number(pageSize) : 12,
      });

      ApiResponseHelper.success(res, result, 'O‘quvchilar ro‘yxati muvaffaqiyatli olindi');
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError('O‘quvchi ID raqami talab qilinadi');
      }

      const profile = await StudentService.getStudentProfile(id);
      ApiResponseHelper.success(res, profile, 'O‘quvchi profili muvaffaqiyatli olindi');
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firstName, lastName, email } = req.body;
      if (!firstName || !lastName || !email) {
        throw new BadRequestError('Ism, familiya va email kiritilishi shart');
      }

      const student = await StudentService.createStudent(req.body, req.user?.email);
      ApiResponseHelper.success(res, student, 'Yangi o‘quvchi muvaffaqiyatli qo‘shildi', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const student = await StudentService.updateStudent(id, req.body, req.user?.email);
      ApiResponseHelper.success(res, student, 'O‘quvchi ma’lumotlari yangilandi');
    } catch (error) {
      next(error);
    }
  }

  static async archive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { archive } = req.body; // boolean
      const student = await StudentService.archiveStudent(
        id,
        archive !== undefined ? Boolean(archive) : true,
        req.user?.email
      );
      ApiResponseHelper.success(
        res,
        student,
        archive ? 'O‘quvchi muvaffaqiyatli arxivlandi' : 'O‘quvchi arxivdan chiqarildi'
      );
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await StudentService.deleteStudent(id, req.user?.email);
      ApiResponseHelper.success(res, result, 'O‘quvchi tizimdan o‘chirildi');
    } catch (error) {
      next(error);
    }
  }

  static async getClassRooms(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const classrooms = await StudentService.getClassRooms();
      ApiResponseHelper.success(res, classrooms, 'Guruhlar ro‘yxati muvaffaqiyatli olindi');
    } catch (error) {
      next(error);
    }
  }
}
