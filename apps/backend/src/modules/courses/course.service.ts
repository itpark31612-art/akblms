import { prisma } from '../../db/prisma';
import { NotFoundError, ConflictError } from '../../errors/AppError';
import { CreateCourseInput, ICourse } from '@ems/shared';

export class CourseService {
  static async getAllCourses(): Promise<ICourse[]> {
    const courses = await prisma.course.findMany({
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return courses.map((c) => ({
      id: c.id,
      code: c.code,
      title: c.title,
      description: c.description || undefined,
      credits: c.credits,
      teacherId: c.teacherId || undefined,
      teacherName: c.teacher ? `${c.teacher.firstName} ${c.teacher.lastName}` : undefined,
      isActive: c.isActive,
      createdAt: c.createdAt.toISOString(),
    }));
  }

  static async getCourseById(id: string): Promise<ICourse> {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundError('Kurs topilmadi');
    }

    return {
      id: course.id,
      code: course.code,
      title: course.title,
      description: course.description || undefined,
      credits: course.credits,
      teacherId: course.teacherId || undefined,
      teacherName: course.teacher
        ? `${course.teacher.firstName} ${course.teacher.lastName}`
        : undefined,
      isActive: course.isActive,
      createdAt: course.createdAt.toISOString(),
    };
  }

  static async createCourse(input: CreateCourseInput): Promise<ICourse> {
    const existing = await prisma.course.findUnique({
      where: { code: input.code.toUpperCase() },
    });

    if (existing) {
      throw new ConflictError('Ushbu kodli kurs allaqachon mavjud');
    }

    const created = await prisma.course.create({
      data: {
        code: input.code.toUpperCase(),
        title: input.title,
        description: input.description,
        credits: input.credits,
        teacherId: input.teacherId,
        isActive: true,
      },
      include: {
        teacher: true,
      },
    });

    return {
      id: created.id,
      code: created.code,
      title: created.title,
      description: created.description || undefined,
      credits: created.credits,
      teacherId: created.teacherId || undefined,
      teacherName: created.teacher
        ? `${created.teacher.firstName} ${created.teacher.lastName}`
        : undefined,
      isActive: created.isActive,
      createdAt: created.createdAt.toISOString(),
    };
  }

  static async updateCourse(id: string, input: Partial<CreateCourseInput>): Promise<ICourse> {
    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Kurs topilmadi');
    }

    const updated = await prisma.course.update({
      where: { id },
      data: {
        code: input.code ? input.code.toUpperCase() : undefined,
        title: input.title,
        description: input.description,
        credits: input.credits,
        teacherId: input.teacherId,
      },
      include: {
        teacher: true,
      },
    });

    return {
      id: updated.id,
      code: updated.code,
      title: updated.title,
      description: updated.description || undefined,
      credits: updated.credits,
      teacherId: updated.teacherId || undefined,
      teacherName: updated.teacher
        ? `${updated.teacher.firstName} ${updated.teacher.lastName}`
        : undefined,
      isActive: updated.isActive,
      createdAt: updated.createdAt.toISOString(),
    };
  }

  static async deleteCourse(id: string): Promise<void> {
    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Kurs topilmadi');
    }

    await prisma.course.delete({ where: { id } });
  }
}
