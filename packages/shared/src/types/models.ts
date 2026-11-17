import { UserRole } from '../constants/roles';

export interface ISchool {
  id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ICourse {
  id: string;
  code: string;
  title: string;
  description?: string;
  credits: number;
  teacherId?: string;
  teacherName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface IClassRoom {
  id: string;
  name: string;
  gradeLevel: number;
  capacity: number;
  academicYear: string;
  schoolId?: string;
}

export interface IAttendance {
  id: string;
  studentId: string;
  studentName?: string;
  courseId: string;
  courseName?: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
}

export interface IGrade {
  id: string;
  studentId: string;
  studentName?: string;
  courseId: string;
  courseName?: string;
  score: number;
  maxScore: number;
  type: 'EXAM' | 'QUIZ' | 'HOMEWORK' | 'FINAL';
  date: string;
  feedback?: string;
}

export interface IAuditLog {
  id: string;
  userId?: string;
  userEmail?: string;
  userRole?: UserRole;
  action: string;
  resource: string;
  details?: Record<string, unknown> | string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface ISystemStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;
  totalParents: number;
  totalCourses: number;
  activeSchools: number;
  attendanceRate: number;
  averageGrade: number;
}

export type PaymentStatusType = 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED';
export type PaymentMethodType = 'PAYME' | 'CLICK' | 'UZUM' | 'CASH' | 'BANK_TRANSFER';

export interface IPayment {
  id: string;
  studentId: string;
  studentName?: string;
  amount: number;
  paidAmount: number;
  status: PaymentStatusType;
  type: string;
  paymentMethod?: PaymentMethodType | null;
  invoiceNumber: string;
  dueDate: string;
  paidAt?: string | null;
  description?: string | null;
  createdAt: string;
}

export interface IScheduleLesson {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  teacherId?: string;
  teacherName?: string;
  classRoomId?: string;
  classRoomName?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  roomNumber: string;
  isActive: boolean;
}

export interface INotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'URGENT';
  isRead: boolean;
  link?: string | null;
  createdAt: string;
}

export interface IAdminDashboardResponse {
  period: string;
  stats: {
    totalStudents: number;
    activeTeachers: number;
    totalGroups: number;
    todayAttendance: {
      rate: number;
      present: number;
      absent: number;
      late: number;
      total: number;
    };
    monthlyRevenue: {
      amount: number;
      growthPercent: number;
    };
    totalDebt: {
      amount: number;
      count: number;
    };
    testResults: {
      averageScore: number;
      passingRate: number;
      totalGraded: number;
    };
    newRegistrations: {
      count: number;
      growthPercent: number;
    };
  };
  charts: {
    monthlyRevenue: Array<{
      month: string;
      revenue: number;
      target: number;
    }>;
    studentGrowth: Array<{
      month: string;
      totalStudents: number;
      newStudents: number;
    }>;
    attendanceDynamics: Array<{
      day: string;
      date: string;
      present: number;
      absent: number;
      late: number;
      attendanceRate: number;
    }>;
    subjectPerformance: Array<{
      subject: string;
      code: string;
      averageScore: number;
      studentsCount: number;
      passRate: number;
    }>;
    paymentStats: {
      statusBreakdown: Array<{ name: string; value: number; amount: number; color: string }>;
      methodBreakdown: Array<{ name: string; value: number; amount: number }>;
    };
  };
  additional: {
    recentActivities: Array<{
      id: string;
      action: string;
      resource: string;
      details: string | null;
      userEmail: string | null;
      createdAt: string;
    }>;
    todayLessons: Array<IScheduleLesson>;
    notifications: Array<INotificationItem>;
  };
}

export interface IStudentSummary {
  id: string;
  studentCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  status: string;
  isActive: boolean;
  birthDate?: string | null;
  address?: string | null;
  classRoomId?: string | null;
  classRoomName?: string | null;
  gradeLevel?: number | null;
  gpa: number;
  attendanceRate: number;
  totalPayments: number;
  pendingDebt: number;
  createdAt: string;
}

export interface IStudentProfile {
  student: IStudentSummary;
  classRoom?: {
    id: string;
    name: string;
    gradeLevel: number;
    academicYear: string;
  } | null;
  parent?: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    email: string;
    relationship: string;
  } | null;
  enrollments: Array<{
    id: string;
    courseId: string;
    courseCode: string;
    courseTitle: string;
    credits: number;
    teacherName?: string | null;
    enrolledAt: string;
    status: string;
  }>;
  attendances: Array<{
    id: string;
    courseName: string;
    date: string;
    status: string;
    remarks?: string | null;
  }>;
  attendanceStats: {
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
    rate: number;
  };
  grades: Array<{
    id: string;
    courseName: string;
    score: number;
    maxScore: number;
    type: string;
    feedback?: string | null;
    date: string;
  }>;
  academicStats: {
    gpa: number;
    averageScore: number;
    totalExams: number;
    passRate: number;
  };
  payments: Array<{
    id: string;
    invoiceNumber: string;
    amount: number;
    paidAmount: number;
    status: string;
    paymentMethod?: string | null;
    dueDate: string;
    paidAt?: string | null;
    description?: string | null;
  }>;
  paymentStats: {
    totalPaid: number;
    totalPending: number;
    totalOverdue: number;
  };
}

export interface ICreateStudentInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  classRoomId?: string;
  birthDate?: string;
  address?: string;
  avatarUrl?: string;
  password?: string;
}

export interface IUpdateStudentInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  classRoomId?: string | null;
  birthDate?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
  status?: string;
}
