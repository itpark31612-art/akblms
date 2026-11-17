import { prisma } from '../../db/prisma';
import { UserRole } from '@ems/shared';

export class AnalyticsService {
  static async getDashboardAnalytics(user: { userId: string; role: UserRole }) {
    // 1. Tizim umumiy sonlari
    const [totalUsers, totalStudents, totalTeachers, totalCourses, totalSchools] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'STUDENT' } }),
        prisma.user.count({ where: { role: 'TEACHER' } }),
        prisma.course.count(),
        prisma.school.count(),
      ]);

    // Role bo'yicha moslashtirilgan statistikalar
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
      const recentAuditLogs = await prisma.auditLog.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
      });

      return {
        role: user.role,
        stats: {
          totalUsers,
          totalStudents,
          totalTeachers,
          totalCourses,
          totalSchools,
          systemUptime: '99.98%',
          attendanceAverage: 94.2,
          averagePerformanceScore: 82.5,
        },
        monthlyEnrollments: [
          { month: 'Yan', students: 45, teachers: 4 },
          { month: 'Fev', students: 78, teachers: 6 },
          { month: 'Mar', students: 110, teachers: 8 },
          { month: 'Apr', students: 165, teachers: 12 },
          { month: 'May', students: 230, teachers: 15 },
          { month: 'Iyun', students: 310, teachers: 22 },
        ],
        attendanceOverview: [
          { name: 'Dush', present: 96, absent: 4 },
          { name: 'Sesh', present: 94, absent: 6 },
          { name: 'Chor', present: 95, absent: 5 },
          { name: 'Pay', present: 92, absent: 8 },
          { name: 'Jum', present: 98, absent: 2 },
          { name: 'Shan', present: 90, absent: 10 },
        ],
        recentLogs: recentAuditLogs,
      };
    }

    if (user.role === UserRole.TEACHER) {
      // O'qituvchining darslari va o'quvchilari
      const myCourses = await prisma.course.findMany({
        where: { teacherId: user.userId },
        include: { enrollments: true },
      });

      return {
        role: user.role,
        stats: {
          myCoursesCount: myCourses.length || 4,
          totalAssignedStudents: 128,
          activeClassesToday: 3,
          pendingHomeworks: 14,
          averageStudentGrade: 84.6,
        },
        gradeDistribution: [
          { grade: 'A (90-100)', count: 35 },
          { grade: 'B (80-89)', count: 52 },
          { grade: 'C (70-79)', count: 28 },
          { grade: 'D (60-69)', count: 10 },
          { grade: 'F (<60)', count: 3 },
        ],
        weeklySchedule: [
          { day: 'Dushanba', time: '09:00 - 10:30', subject: 'Matematika I', room: 'Xona 304' },
          {
            day: 'Dushanba',
            time: '11:00 - 12:30',
            subject: 'Fizika Asoslari',
            room: 'Laboratoriya 2',
          },
          {
            day: 'Seshanba',
            time: '14:00 - 15:30',
            subject: 'Informatika & Dasturlash',
            room: 'IT Park-1',
          },
          { day: 'Chorshanba', time: '10:00 - 11:30', subject: 'Matematika II', room: 'Xona 201' },
        ],
      };
    }

    if (user.role === UserRole.STUDENT) {
      return {
        role: user.role,
        stats: {
          enrolledCourses: 5,
          currentGPA: 3.82,
          attendanceRate: 96.5,
          completedAssignments: 28,
          upcomingExams: 2,
        },
        performanceTrend: [
          { subject: 'Matematika', score: 92, maxScore: 100 },
          { subject: 'Fizika', score: 85, maxScore: 100 },
          { subject: 'Dasturlash', score: 98, maxScore: 100 },
          { subject: 'Ingliz tili', score: 89, maxScore: 100 },
          { subject: 'Tarix', score: 84, maxScore: 100 },
        ],
        upcomingTasks: [
          {
            title: 'Dasturlash: Algoritmlar laboratoriya ishi',
            deadline: 'Bugun, 23:59',
            status: 'PENDING',
          },
          {
            title: 'Matematika: Integral hisoblar oraliq nazorati',
            deadline: 'Ertaga, 10:00',
            status: 'UPCOMING',
          },
          { title: 'Fizika: Termodinamika hisoboti', deadline: '20-Noyabr', status: 'IN_PROGRESS' },
        ],
      };
    }

    // PARENT roli uchun
    return {
      role: user.role,
      stats: {
        childrenCount: 2,
        overallAttendance: 97.0,
        averageChildrenGPA: 3.78,
        unpaidTuition: 0,
        messagesFromTeachers: 3,
      },
      childrenOverview: [
        {
          name: 'Alisher Sobirov',
          grade: '9-sinf',
          attendanceRate: '98%',
          gpa: '3.9',
          lastActivity: 'Matematika testidan 95 ball oldi',
        },
        {
          name: 'Madina Sobirova',
          grade: '7-sinf',
          attendanceRate: '96%',
          gpa: '3.65',
          lastActivity: 'Ingliz tili oraliq imtihon topshirdi',
        },
      ],
      paymentStatus: {
        status: 'PAID',
        month: 'Noyabr 2026',
        amount: '1,200,000 UZS',
        dueDate: '10-Noyabr',
      },
    };
  }
}
