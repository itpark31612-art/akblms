import { prisma } from '../../db/prisma';
import {
  IStudentSummary,
  IStudentProfile,
  ICreateStudentInput,
  IUpdateStudentInput,
} from '@ems/shared';
import { Prisma, UserStatus, Role, AttendanceStatus, PaymentStatus } from '@prisma/client';
import { NotFoundError, ConflictError } from '../../errors/AppError';
import bcrypt from 'bcryptjs';

export interface StudentFilterParams {
  search?: string;
  status?: string;
  classRoomId?: string;
  page?: number;
  pageSize?: number;
}

export class StudentService {
  /**
   * O'quvchilar ro'yxatini filtrlash va paginatsiya bilan olish
   */
  static async getStudents(params: StudentFilterParams) {
    const page = Math.max(1, Number(params.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(params.pageSize) || 12));
    const skip = (page - 1) * pageSize;

    const where: Prisma.UserWhereInput = {
      role: Role.STUDENT,
    };

    // Status filtri
    if (params.status && params.status !== 'ALL') {
      where.status = params.status as UserStatus;
    }

    // Guruh filtri
    if (params.classRoomId && params.classRoomId !== 'ALL') {
      where.classRoomId = params.classRoomId;
    }

    // Qidiruv (ism, familiya, email, telefon, studentCode)
    if (params.search && params.search.trim()) {
      const q = params.search.trim();
      where.OR = [
        { firstName: { contains: q, mode: 'insensitive' } },
        { lastName: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { studentCode: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [total, studentsRaw] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          classRoom: true,
          grades: true,
          attendances: true,
          payments: true,
        },
      }),
    ]);

    const items: IStudentSummary[] = studentsRaw.map((s) => {
      // GPA hisoblash (0-4.0 shkala yoki 100 ballik)
      let gpa = 3.6;
      if (s.grades.length > 0) {
        const avg = s.grades.reduce((sum, g) => sum + (g.score / (g.maxScore || 100)) * 100, 0) / s.grades.length;
        gpa = Math.round(((avg / 100) * 4) * 100) / 100;
      }

      // Davomat foizi
      let attendanceRate = 95.0;
      if (s.attendances.length > 0) {
        const presentCount = s.attendances.filter(
          (a) => a.status === AttendanceStatus.PRESENT || a.status === AttendanceStatus.EXCUSED
        ).length;
        const lateCount = s.attendances.filter((a) => a.status === AttendanceStatus.LATE).length;
        attendanceRate = Math.round(((presentCount + lateCount * 0.5) / s.attendances.length) * 100 * 10) / 10;
      }

      // To'lovlar va qarzdorlik
      const totalPaid = s.payments
        .filter((p) => p.status === PaymentStatus.PAID)
        .reduce((sum, p) => sum + (p.paidAmount || p.amount), 0);

      const pendingDebt = s.payments
        .filter((p) => p.status === PaymentStatus.PENDING || p.status === PaymentStatus.OVERDUE)
        .reduce((sum, p) => sum + (p.amount - (p.paidAmount || 0)), 0);

      return {
        id: s.id,
        studentCode: s.studentCode || `STU-${s.createdAt.getFullYear()}-${s.id.slice(0, 4)}`,
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email,
        phone: s.phone,
        avatarUrl: s.avatarUrl,
        status: s.status,
        isActive: s.isActive,
        birthDate: s.birthDate ? s.birthDate.toISOString() : null,
        address: s.address,
        classRoomId: s.classRoomId,
        classRoomName: s.classRoom?.name || null,
        gradeLevel: s.classRoom?.gradeLevel || null,
        gpa,
        attendanceRate,
        totalPayments: totalPaid,
        pendingDebt,
        createdAt: s.createdAt.toISOString(),
      };
    });

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    };
  }

  /**
   * Bitta o'quvchining to'liq profil ma'lumotlarini (barcha tarixi bilan) olish
   */
  static async getStudentProfile(id: string): Promise<IStudentProfile> {
    const student = await prisma.user.findUnique({
      where: { id },
      include: {
        classRoom: true,
        parentRelations: {
          include: {
            parent: true,
          },
        },
        enrollments: {
          include: {
            course: {
              include: {
                teacher: true,
              },
            },
          },
          orderBy: { enrolledAt: 'desc' },
        },
        attendances: {
          include: {
            course: true,
          },
          orderBy: { date: 'desc' },
          take: 30,
        },
        grades: {
          include: {
            course: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!student || student.role !== Role.STUDENT) {
      throw new NotFoundError(`O‘quvchi topilmadi (ID: ${id})`);
    }

    // Davomat statistikasi
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;

    for (const a of student.attendances) {
      if (a.status === AttendanceStatus.PRESENT) present++;
      else if (a.status === AttendanceStatus.ABSENT) absent++;
      else if (a.status === AttendanceStatus.LATE) late++;
      else if (a.status === AttendanceStatus.EXCUSED) excused++;
    }

    const totalAtt = present + absent + late + excused;
    const attRate = totalAtt > 0 ? Math.round(((present + excused + late * 0.5) / totalAtt) * 100 * 10) / 10 : 95.0;

    // Akademik statistika & GPA
    let averageScore = 85.0;
    let gpa = 3.65;
    let passRate = 90.0;

    if (student.grades.length > 0) {
      const sum = student.grades.reduce((acc, g) => acc + (g.score / (g.maxScore || 100)) * 100, 0);
      averageScore = Math.round((sum / student.grades.length) * 10) / 10;
      gpa = Math.round(((averageScore / 100) * 4) * 100) / 100;
      const passed = student.grades.filter((g) => (g.score / (g.maxScore || 100)) >= 0.6).length;
      passRate = Math.round((passed / student.grades.length) * 100 * 10) / 10;
    }

    // To'lov statistikasi
    let totalPaid = 0;
    let totalPending = 0;
    let totalOverdue = 0;

    for (const p of student.payments) {
      if (p.status === PaymentStatus.PAID) {
        totalPaid += p.paidAmount || p.amount;
      } else if (p.status === PaymentStatus.PENDING) {
        totalPending += p.amount - (p.paidAmount || 0);
      } else if (p.status === PaymentStatus.OVERDUE) {
        totalOverdue += p.amount - (p.paidAmount || 0);
      }
    }

    const parentRel = student.parentRelations[0];

    const studentSummary: IStudentSummary = {
      id: student.id,
      studentCode: student.studentCode || `STU-${student.createdAt.getFullYear()}-${student.id.slice(0, 4)}`,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      avatarUrl: student.avatarUrl,
      status: student.status,
      isActive: student.isActive,
      birthDate: student.birthDate ? student.birthDate.toISOString() : null,
      address: student.address,
      classRoomId: student.classRoomId,
      classRoomName: student.classRoom?.name || null,
      gradeLevel: student.classRoom?.gradeLevel || null,
      gpa,
      attendanceRate: attRate,
      totalPayments: totalPaid,
      pendingDebt: totalPending + totalOverdue,
      createdAt: student.createdAt.toISOString(),
    };

    return {
      student: studentSummary,
      classRoom: student.classRoom
        ? {
            id: student.classRoom.id,
            name: student.classRoom.name,
            gradeLevel: student.classRoom.gradeLevel,
            academicYear: student.classRoom.academicYear,
          }
        : null,
      parent: parentRel
        ? {
            id: parentRel.parent.id,
            firstName: parentRel.parent.firstName,
            lastName: parentRel.parent.lastName,
            phone: parentRel.parent.phone,
            email: parentRel.parent.email,
            relationship: parentRel.relationship,
          }
        : null,
      enrollments: student.enrollments.map((e) => ({
        id: e.id,
        courseId: e.courseId,
        courseCode: e.course.code,
        courseTitle: e.course.title,
        credits: e.course.credits,
        teacherName: e.course.teacher ? `${e.course.teacher.firstName} ${e.course.teacher.lastName}` : null,
        enrolledAt: e.enrolledAt.toISOString(),
        status: e.status,
      })),
      attendances: student.attendances.map((a) => ({
        id: a.id,
        courseName: a.course.title,
        date: a.date.toISOString(),
        status: a.status,
        remarks: a.remarks,
      })),
      attendanceStats: {
        present,
        absent,
        late,
        excused,
        total: totalAtt,
        rate: attRate,
      },
      grades: student.grades.map((g) => ({
        id: g.id,
        courseName: g.course.title,
        score: g.score,
        maxScore: g.maxScore,
        type: g.type,
        feedback: g.feedback,
        date: g.createdAt.toISOString(),
      })),
      academicStats: {
        gpa,
        averageScore,
        totalExams: student.grades.length,
        passRate,
      },
      payments: student.payments.map((p) => ({
        id: p.id,
        invoiceNumber: p.invoiceNumber,
        amount: p.amount,
        paidAmount: p.paidAmount,
        status: p.status,
        paymentMethod: p.paymentMethod,
        dueDate: p.dueDate.toISOString(),
        paidAt: p.paidAt ? p.paidAt.toISOString() : null,
        description: p.description,
      })),
      paymentStats: {
        totalPaid,
        totalPending,
        totalOverdue,
      },
    };
  }

  /**
   * Yangi o'quvchi qo'shish
   */
  static async createStudent(input: ICreateStudentInput, creatorEmail = 'admin@ems.local') {
    // 1. Email takrorlanmasligini tekshirish
    const existing = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase().trim() },
    });
    if (existing) {
      throw new ConflictError(`"${input.email}" elektron pochtasi bilan boshqa foydalanuvchi mavjud`);
    }

    // 2. Student code generatsiya qilish (STU-2026-XXXX)
    const count = await prisma.user.count({ where: { role: Role.STUDENT } });
    const studentCode = `STU-${new Date().getFullYear()}-${String(1001 + count).padStart(4, '0')}`;

    // 3. Parol hash
    const rawPassword = input.password || 'Student123!';
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    // 4. Default avatar
    const defaultAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    ];
    const avatarUrl = input.avatarUrl || defaultAvatars[count % defaultAvatars.length];

    const student = await prisma.user.create({
      data: {
        email: input.email.toLowerCase().trim(),
        passwordHash,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        phone: input.phone?.trim() || null,
        role: Role.STUDENT,
        status: UserStatus.ACTIVE,
        isActive: true,
        studentCode,
        classRoomId: input.classRoomId || null,
        birthDate: input.birthDate ? new Date(input.birthDate) : null,
        address: input.address?.trim() || null,
        avatarUrl,
      },
      include: {
        classRoom: true,
      },
    });

    // 5. Bir nechta asosiy kurslarga avtomatik ro'yxatga olish (Enrollment)
    const defaultCourses = await prisma.course.findMany({ take: 3 });
    for (const c of defaultCourses) {
      await prisma.enrollment.create({
        data: {
          studentId: student.id,
          courseId: c.id,
          status: 'ACTIVE',
        },
      });
    }

    // 6. AuditLog
    await prisma.auditLog.create({
      data: {
        action: 'STUDENT_REGISTERED',
        resource: 'User',
        details: `Yangi o‘quvchi ro‘yxatga olindi: ${student.firstName} ${student.lastName} (${student.studentCode})`,
        userEmail: creatorEmail,
      },
    });

    return student;
  }

  /**
   * O'quvchi ma'lumotlarini tahrirlash
   */
  static async updateStudent(id: string, input: IUpdateStudentInput, updaterEmail = 'admin@ems.local') {
    const student = await prisma.user.findUnique({
      where: { id },
    });

    if (!student || student.role !== Role.STUDENT) {
      throw new NotFoundError(`O‘quvchi topilmadi (ID: ${id})`);
    }

    const data: Prisma.UserUpdateInput = {};

    if (input.firstName !== undefined) data.firstName = input.firstName.trim();
    if (input.lastName !== undefined) data.lastName = input.lastName.trim();
    if (input.phone !== undefined) data.phone = input.phone ? input.phone.trim() : null;
    if (input.address !== undefined) data.address = input.address ? input.address.trim() : null;
    if (input.avatarUrl !== undefined) data.avatarUrl = input.avatarUrl;
    if (input.birthDate !== undefined) {
      data.birthDate = input.birthDate ? new Date(input.birthDate) : null;
    }
    if (input.classRoomId !== undefined) {
      data.classRoom = input.classRoomId
        ? { connect: { id: input.classRoomId } }
        : { disconnect: true };
    }
    if (input.status !== undefined) {
      data.status = input.status as UserStatus;
      data.isActive = input.status === UserStatus.ACTIVE;
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
      include: { classRoom: true },
    });

    await prisma.auditLog.create({
      data: {
        action: 'STUDENT_UPDATED',
        resource: 'User',
        details: `O‘quvchi ma’lumotlari tahrirlandi: ${updated.firstName} ${updated.lastName} (${updated.studentCode})`,
        userEmail: updaterEmail,
      },
    });

    return updated;
  }

  /**
   * O'quvchini arxivlash yoki arxivdan chiqarish
   */
  static async archiveStudent(id: string, archive: boolean, adminEmail = 'admin@ems.local') {
    const student = await prisma.user.findUnique({ where: { id } });
    if (!student || student.role !== Role.STUDENT) {
      throw new NotFoundError(`O‘quvchi topilmadi (ID: ${id})`);
    }

    const newStatus = archive ? UserStatus.ARCHIVED : UserStatus.ACTIVE;
    const updated = await prisma.user.update({
      where: { id },
      data: {
        status: newStatus,
        isActive: !archive,
      },
      include: { classRoom: true },
    });

    await prisma.auditLog.create({
      data: {
        action: archive ? 'STUDENT_ARCHIVED' : 'STUDENT_RESTORED',
        resource: 'User',
        details: `O‘quvchi ${archive ? 'arxivlandi' : 'arxivdan chiqarildi'}: ${updated.firstName} ${updated.lastName} (${updated.studentCode})`,
        userEmail: adminEmail,
      },
    });

    return updated;
  }

  /**
   * O'quvchini o'chirish
   */
  static async deleteStudent(id: string, adminEmail = 'admin@ems.local') {
    const student = await prisma.user.findUnique({ where: { id } });
    if (!student || student.role !== Role.STUDENT) {
      throw new NotFoundError(`O‘quvchi topilmadi (ID: ${id})`);
    }

    await prisma.user.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        action: 'STUDENT_DELETED',
        resource: 'User',
        details: `O‘quvchi tizimdan o‘chirildi: ${student.firstName} ${student.lastName} (${student.studentCode})`,
        userEmail: adminEmail,
      },
    });

    return { id, message: 'O‘quvchi muvaffaqiyatli o‘chirildi' };
  }

  /**
   * Guruhlar (ClassRooms) ro'yxatini filtrlash uchun olish
   */
  static async getClassRooms() {
    return prisma.classRoom.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { students: true },
        },
      },
    });
  }
}
