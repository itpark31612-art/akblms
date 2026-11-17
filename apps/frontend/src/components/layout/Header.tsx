import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../design-system/components/Toast';
import { Dropdown } from '../../design-system/components/Dropdown';
import { Search } from '../../design-system/components/Search';
import { UserRole, ROLE_LABELS } from '@ems/shared';
import {
  Bell,
  ShieldCheck,
  ChevronDown,
  Check,
  Sun,
  Moon,
  Menu,
  Activity,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { user, role, switchRole, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const toast = useToast();

  const rolesList: UserRole[] = [
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.TEACHER,
    UserRole.STUDENT,
    UserRole.PARENT,
  ];

  const roleDropdownItems = rolesList.map((r) => ({
    key: r,
    label: (
      <div className="flex items-center justify-between w-full">
        <span>{ROLE_LABELS[r]}</span>
        {role === r && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
      </div>
    ),
    onClick: () => {
      switchRole(r);
      toast.info(`Rol almashtirildi`, `Siz hozir ${ROLE_LABELS[r]} sifatida ko‘rmoqdasiz`);
    },
  }));

  const userDropdownItems = [
    {
      key: 'profile',
      label: 'Shaxsiy Profil',
      icon: <UserIcon className="w-4 h-4" />,
      onClick: () => (window.location.href = '/settings'),
    },
    {
      key: 'logout',
      label: 'Tizimdan chiqish',
      icon: <LogOut className="w-4 h-4" />,
      danger: true,
      onClick: () => logout(),
    },
  ];

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left: Mobile Hamburger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          title="Menyu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block w-full max-w-xs">
          <Search onChange={(val) => val && console.log('Searching for:', val)} />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Role Switcher Dropdown */}
        <Dropdown
          trigger={
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition-all select-none">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden md:inline">
                Rol:{' '}
                <strong className="text-indigo-600 dark:text-indigo-400">
                  {role ? ROLE_LABELS[role] : 'Tanlanmagan'}
                </strong>
              </span>
              <span className="md:hidden text-indigo-600 dark:text-indigo-400 font-bold">
                {role ? ROLE_LABELS[role].split(' ')[0] : 'Rol'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          }
          items={roleDropdownItems}
          width="w-60"
        />

        {/* Theme Toggle (Light / Dark) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          title={isDark ? 'Yorug‘ rejimga o‘tish' : 'Qorong‘u rejimga o‘tish'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 transition-transform hover:-rotate-12" />
          )}
        </button>

        {/* System Status Pill */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold rounded-full">
          <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>v1 Faol</span>
        </div>

        {/* Notifications Button */}
        <button
          type="button"
          onClick={() => toast.info('Bildirishnoma', 'Barcha tizim dars jadvallari yangilandi')}
          className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          title="Xabarnomalar"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
        </button>

        {/* User Profile Dropdown */}
        <Dropdown
          trigger={
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 select-none">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden md:block">
                {user?.firstName}
              </span>
            </div>
          }
          items={userDropdownItems}
          width="w-48"
        />
      </div>
    </header>
  );
};
