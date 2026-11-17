'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ROLE_PERMISSIONS =
  exports.ROLE_DESCRIPTIONS =
  exports.ROLE_LABELS =
  exports.USER_ROLES =
  exports.UserRole =
    void 0;
var UserRole;
(function (UserRole) {
  UserRole['SUPER_ADMIN'] = 'SUPER_ADMIN';
  UserRole['ADMIN'] = 'ADMIN';
  UserRole['TEACHER'] = 'TEACHER';
  UserRole['STUDENT'] = 'STUDENT';
  UserRole['PARENT'] = 'PARENT';
})(UserRole || (exports.UserRole = UserRole = {}));
exports.USER_ROLES = Object.values(UserRole);
exports.ROLE_LABELS = {
  [UserRole.SUPER_ADMIN]: 'Super Admin',
  [UserRole.ADMIN]: 'Administrator',
  [UserRole.TEACHER]: "O'qituvchi",
  [UserRole.STUDENT]: "O'quvchi",
  [UserRole.PARENT]: 'Ota-ona',
};
exports.ROLE_DESCRIPTIONS = {
  [UserRole.SUPER_ADMIN]: 'Tizimning to‘liq nazorati, barcha maktablar va global sozlamalar',
  [UserRole.ADMIN]: 'Maktab ma’muriyati, o‘qituvchilar, guruhlar va tizim resurslari',
  [UserRole.TEACHER]: 'Dars jadvallari, fanlar, baholash, davomat va o‘quvchilar progressi',
  [UserRole.STUDENT]: 'Shaxsiy darslar, topshiriqlar, baholar va davomat tahlili',
  [UserRole.PARENT]: 'Farzandlarning o‘qish natijalari, davomati va to‘lovlar monitoringi',
};
exports.ROLE_PERMISSIONS = {
  [UserRole.SUPER_ADMIN]: [
    'system:manage',
    'schools:manage',
    'users:all',
    'analytics:global',
    'audit:view',
    'billing:manage',
  ],
  [UserRole.ADMIN]: [
    'school:manage',
    'users:manage',
    'courses:manage',
    'classes:manage',
    'analytics:school',
    'reports:generate',
  ],
  [UserRole.TEACHER]: [
    'courses:teach',
    'classes:view',
    'grades:manage',
    'attendance:manage',
    'assignments:manage',
  ],
  [UserRole.STUDENT]: [
    'courses:view',
    'assignments:submit',
    'grades:view_self',
    'attendance:view_self',
  ],
  [UserRole.PARENT]: [
    'children:view_grades',
    'children:view_attendance',
    'payments:view',
    'teachers:contact',
  ],
};
//# sourceMappingURL=roles.js.map
