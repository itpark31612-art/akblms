import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '@ems/shared';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Award,
  CreditCard,
  Settings,
  LogOut,
  GraduationCap,
  BarChart3,
  Shield,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  roles?: UserRole[];
}

export const Sidebar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems: NavItem[] = [
    {
      name: 'Boshqaruv Paneli',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: 'Foydalanuvchilar',
      href: '/users',
      icon: <Users className="w-5 h-5" />,
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER],
    },
    {
      name: 'Kurslar & Fanlar',
      href: '/courses',
      icon: <BookOpen className="w-5 h-5" />,
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
    },
    {
      name: 'Analitika & Grafiklar',
      href: '/analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
    },
    {
      name: 'Dars Jadvali',
      href: '/schedule',
      icon: <Calendar className="w-5 h-5" />,
      roles: [UserRole.TEACHER, UserRole.STUDENT],
    },
    {
      name: 'Baholar & Natijalar',
      href: '/grades',
      icon: <Award className="w-5 h-5" />,
      roles: [UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT],
    },
    {
      name: 'To‘lovlar & Moliya',
      href: '/payments',
      icon: <CreditCard className="w-5 h-5" />,
      roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PARENT],
    },
    {
      name: 'Tizim Sozlamalari',
      href: '/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  // Foydalanuvchi roliga qarab filtrlash
  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return role ? item.roles.includes(role) || role === UserRole.SUPER_ADMIN : false;
  });

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800">
        <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-500/20">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <span className="font-bold text-base tracking-tight text-white block">EMS Platform</span>
          <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase block">
            Enterprise Edu
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Asosiy Menyu
        </div>
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Role & Status Info Box */}
      <div className="p-3 mx-3 mb-3 bg-slate-800/70 border border-slate-700/60 rounded-xl">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
          <Shield className="w-4 h-4 text-indigo-400" />
          <span>Kirish darajasi:</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs font-semibold text-white bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded-md">
            {role || 'Mehmon'}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </span>
        </div>
      </div>

      {/* User Footer and Logout */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-sm shrink-0">
            {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-white truncate">
              {user ? `${user.firstName} ${user.lastName}` : 'Foydalanuvchi'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Tizimdan chiqish"
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
