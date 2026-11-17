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
//# sourceMappingURL=models.d.ts.map
