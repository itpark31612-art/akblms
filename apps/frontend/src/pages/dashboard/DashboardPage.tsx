import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '@ems/shared';
import { SuperAdminDashboardView } from './views/SuperAdminDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { TeacherDashboardView } from './views/TeacherDashboardView';
import { StudentDashboardView } from './views/StudentDashboardView';
import { ParentDashboardView } from './views/ParentDashboardView';

export const DashboardPage: React.FC = () => {
  const { role } = useAuth();

  switch (role) {
    case UserRole.SUPER_ADMIN:
      return <SuperAdminDashboardView />;
    case UserRole.ADMIN:
      return <AdminDashboardView />;
    case UserRole.TEACHER:
      return <TeacherDashboardView />;
    case UserRole.STUDENT:
      return <StudentDashboardView />;
    case UserRole.PARENT:
      return <ParentDashboardView />;
    default:
      return <SuperAdminDashboardView />;
  }
};
