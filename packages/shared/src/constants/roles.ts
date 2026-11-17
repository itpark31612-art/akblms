export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  SUSPENDED = 'SUSPENDED',
}

export const USER_ROLES = Object.values(UserRole);
export const USER_STATUSES = Object.values(UserStatus);

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Admin',
  [UserRole.ADMIN]: 'Administrator',
  [UserRole.TEACHER]: "O'qituvchi",
  [UserRole.STUDENT]: "O'quvchi",
  [UserRole.PARENT]: 'Ota-ona',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Tizimning to‘liq nazorati, barcha maktablar va global sozlamalar',
  [UserRole.ADMIN]: 'Maktab ma’muriyati, o‘qituvchilar, guruhlar va tizim resurslari',
  [UserRole.TEACHER]: 'Dars jadvallari, fanlar, baholash, davomat va o‘quvchilar progressi',
  [UserRole.STUDENT]: 'Shaxsiy darslar, topshiriqlar, baholar va davomat tahlili',
  [UserRole.PARENT]: 'Farzandlarning o‘qish natijalari, davomati va to‘lovlar monitoringi',
};

export const AppPermission = {
  // Users & Access
  USERS_READ: 'users:read',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  USERS_STATUS: 'users:status',

  // Courses & Curriculum
  COURSES_READ: 'courses:read',
  COURSES_MANAGE: 'courses:manage',
  COURSES_TEACH: 'courses:teach',

  // Grades & Academic
  GRADES_MANAGE: 'grades:manage',
  GRADES_READ_ALL: 'grades:read_all',
  GRADES_VIEW_SELF: 'grades:view_self',

  // Attendance
  ATTENDANCE_MANAGE: 'attendance:manage',
  ATTENDANCE_VIEW_SELF: 'attendance:view_self',

  // Analytics & Auditing
  ANALYTICS_GLOBAL: 'analytics:global',
  ANALYTICS_SCHOOL: 'analytics:school',
  AUDIT_VIEW: 'audit:view',

  // System Administration
  SYSTEM_MANAGE: 'system:manage',
  SCHOOLS_MANAGE: 'schools:manage',
  BILLING_MANAGE: 'billing:manage',

  // Self Profile
  PROFILE_VIEW: 'profile:view',
  PROFILE_UPDATE: 'profile:update',
} as const;

export type Permission = (typeof AppPermission)[keyof typeof AppPermission] | string;

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.SUPER_ADMIN]: [
    '*', // Wildcard - barcha huquqlarga ega
    AppPermission.SYSTEM_MANAGE,
    AppPermission.SCHOOLS_MANAGE,
    AppPermission.USERS_READ,
    AppPermission.USERS_CREATE,
    AppPermission.USERS_UPDATE,
    AppPermission.USERS_DELETE,
    AppPermission.USERS_STATUS,
    AppPermission.COURSES_READ,
    AppPermission.COURSES_MANAGE,
    AppPermission.GRADES_READ_ALL,
    AppPermission.GRADES_MANAGE,
    AppPermission.ANALYTICS_GLOBAL,
    AppPermission.AUDIT_VIEW,
    AppPermission.BILLING_MANAGE,
    AppPermission.PROFILE_VIEW,
    AppPermission.PROFILE_UPDATE,
  ],
  [UserRole.ADMIN]: [
    AppPermission.SCHOOLS_MANAGE,
    AppPermission.USERS_READ,
    AppPermission.USERS_CREATE,
    AppPermission.USERS_UPDATE,
    AppPermission.USERS_STATUS,
    AppPermission.COURSES_READ,
    AppPermission.COURSES_MANAGE,
    AppPermission.GRADES_READ_ALL,
    AppPermission.ANALYTICS_SCHOOL,
    AppPermission.PROFILE_VIEW,
    AppPermission.PROFILE_UPDATE,
  ],
  [UserRole.TEACHER]: [
    AppPermission.COURSES_READ,
    AppPermission.COURSES_TEACH,
    AppPermission.GRADES_MANAGE,
    AppPermission.ATTENDANCE_MANAGE,
    AppPermission.PROFILE_VIEW,
    AppPermission.PROFILE_UPDATE,
  ],
  [UserRole.STUDENT]: [
    AppPermission.COURSES_READ,
    AppPermission.GRADES_VIEW_SELF,
    AppPermission.ATTENDANCE_VIEW_SELF,
    AppPermission.PROFILE_VIEW,
    AppPermission.PROFILE_UPDATE,
  ],
  [UserRole.PARENT]: [
    AppPermission.GRADES_VIEW_SELF,
    AppPermission.ATTENDANCE_VIEW_SELF,
    AppPermission.PROFILE_VIEW,
    AppPermission.PROFILE_UPDATE,
  ],
};

export const hasRolePermission = (role: UserRole, permission: string): boolean => {
  if (role === UserRole.SUPER_ADMIN) return true;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes('*') || permissions.includes(permission);
};
