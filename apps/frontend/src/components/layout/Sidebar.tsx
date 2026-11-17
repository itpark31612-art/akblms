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
  X,
} from 'lucide-react';

interface SidebarProps {
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  roles?: UserRole[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobile = false, onCloseMobile }) => {
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
      name: 'O‘quvchilar',
      href: '/students',
      icon: <GraduationCap className="w-5 h-5" />,
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

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return role ? item.roles.includes(role) || role === UserRole.SUPER_ADMIN : false;
  });

  return (
    <aside
      className={`${
        isMobile ? 'w-full h-full' : 'w-64 min-h-screen hidden lg:flex'
      } bg-slate-950 dark:bg-slate-950 text-slate-200 flex flex-col shrink-0 border-r border-slate-800 select-none`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/25">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-white block">
              EMS Platform
            </span>
            <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase block">
              Enterprise SaaS
            </span>
          </div>
        </div>

        {isMobile && onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3.5 py-5 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Asosiy Navigatsiya
        </div>
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={isMobile ? onCloseMobile : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Role Badge Status Box */}
      <div className="p-3 mx-3 mb-3 bg-slate-900/80 border border-slate-800/90 rounded-2xl">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[11px] font-medium">Faol Rol:</span>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </span>
        </div>
        <div className="mt-1.5 text-xs font-bold text-white bg-indigo-500/15 border border-indigo-500/25 px-2.5 py-1 rounded-lg text-center">
          {role || 'Mehmon'}
        </div>
      </div>

      {/* User Footer and Logout */}
      <div className="p-4 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs shrink-0">
            {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
          </div>
          <div className="truncate text-left">
            <p className="text-xs font-bold text-white truncate">
              {user ? `${user.firstName} ${user.lastName}` : 'Foydalanuvchi'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Tizimdan chiqish"
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
