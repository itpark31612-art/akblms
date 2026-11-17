import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, ROLE_LABELS } from '@ems/shared';
import { Bell, Search, ShieldCheck, ChevronDown, Check, Activity } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, role, switchRole } = useAuth();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const rolesList: UserRole[] = [
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.TEACHER,
    UserRole.STUDENT,
    UserRole.PARENT,
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input */}
      <div className="flex items-center gap-3 w-72">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Qidiruv (o‘quvchi, kurs, sinf)..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Architect Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-all cursor-pointer"
            title="Sinov uchun rolni tezkor almashtirish"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>
              Rol:{' '}
              <strong className="text-indigo-600">
                {role ? ROLE_LABELS[role] : 'Tanlanmagan'}
              </strong>
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Rolni almashtirish (Test)
              </div>
              {rolesList.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                    role === r ? 'text-indigo-600 font-semibold bg-indigo-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{ROLE_LABELS[r]}</span>
                  {role === r && <Check className="w-4 h-4 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* System Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium rounded-full">
          <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span>API: v1 Faol</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-900">Xabarnomalar</span>
                <button
                  onClick={() => setNotificationCount(0)}
                  className="text-[11px] text-indigo-600 hover:underline cursor-pointer"
                >
                  O‘qilgan deb belgilash
                </button>
              </div>
              <div className="mt-2 space-y-2">
                <div className="p-2 bg-slate-50 rounded-lg text-xs">
                  <p className="font-medium text-slate-800">Yangi dars jadvali e’lon qilindi</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">10 daqiqa oldin</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg text-xs">
                  <p className="font-medium text-slate-800">Oraliq nazorat baholari kiritildi</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">1 soat oldin</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
            {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
          </div>
          <span className="text-xs font-semibold text-slate-700 hidden md:block">
            {user?.firstName}
          </span>
        </div>
      </div>
    </header>
  );
};
