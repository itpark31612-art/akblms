import { Request, Response, NextFunction } from 'express';
import { CourseService } from './course.service';
import { ApiResponseHelper } from '../../utils/apiResponse';

export class CourseController {
  static async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const courses = await CourseService.getAllCourses();
      ApiResponseHelper.success(res, courses);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const course = await CourseService.getCourseById(req.params.id);
      ApiResponseHelper.success(res, course);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const course = await CourseService.createCourse(req.body);
      ApiResponseHelper.created(res, course, 'Kurs muvaffaqiyatli yaratildi');
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const course = await CourseService.updateCourse(req.params.id, req.body);
      ApiResponseHelper.success(res, course, 'Kurs yangilandi');
    } catch (error) {
      next(error);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await CourseService.deleteCourse(req.params.id);
      ApiResponseHelper.success(res, null, 'Kurs muvaffaqiyatli o‘chirildi');
    } catch (error) {
      next(error);
    }
  }
}
