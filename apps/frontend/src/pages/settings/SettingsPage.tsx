import React, { useState } from 'react';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';
import { Badge } from '../../design-system/components/Badge';
import { useToast } from '../../design-system/components/Toast';
import { PageTransition } from '../../design-system/motion/PageTransition';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS, ROLE_DESCRIPTIONS, ROLE_PERMISSIONS } from '@ems/shared';
import { Shield, Bell, Lock, Save, KeyRound, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, role, permissions, updateProfile, changePassword } = useAuth();
  const toast = useToast();

  // Profile Form State
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Notification Preferences State
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      await updateProfile({
        firstName,
        lastName,
        phone,
      });
      toast.success('Muvaffaqiyatli', 'Profil ma’lumotlari yangilandi');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Profilni yangilashda xatolik';
      toast.error('Xatolik', msg);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Xatolik', 'Barcha maydonlarni to‘ldiring');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Xatolik', 'Yangi parol va tasdiqlash mos kelmadi');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Xatolik', 'Yangi parol kamida 6 belgidan iborat bo‘lishi kerak');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword({
        currentPassword,
        newPassword,
      });
      toast.success('Parol yangilandi', 'Yangi parol muvaffaqiyatli o‘rnatildi');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Parolni o‘zgartirishda xatolik';
      toast.error('Xatolik', msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const activePermissions =
    permissions.length > 0 ? permissions : role ? ROLE_PERMISSIONS[role] || [] : [];

  return (
    <PageTransition className="max-w-4xl mx-auto space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Tizim & Profil Sozlamalari
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Shaxsiy hisob ma’lumotlari, RBAC huquqlari va xavfsizlik parametrlari
        </p>
      </div>

      {/* 1. Profile Information */}
      <Card>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Shaxsiy Ma’lumotlar
            </h3>
            {role && <Badge role={role}>{ROLE_LABELS[role]}</Badge>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Ism"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Familiya"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <Input
              label="Elektron pochta"
              value={user?.email || 'user@ems.local'}
              disabled
              helperText="Elektron pochtani o‘zgartirish uchun administrator bilan bog‘laning"
            />
            <Input
              label="Telefon raqami"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998901234567"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={isUpdatingProfile}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Ma’lumotlarni saqlash
            </Button>
          </div>
        </form>
      </Card>

      {/* 2. Security: Change Password */}
      <Card>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Parolni O‘zgartirish
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Joriy parol"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              label="Yangi parol"
              type="password"
              placeholder="Kamida 6 belgi"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              label="Yangi parolni tasdiqlash"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="outline"
              isLoading={isChangingPassword}
              leftIcon={<KeyRound className="w-4 h-4" />}
            >
              Parolni yangilash
            </Button>
          </div>
        </form>
      </Card>

      {/* 3. Role-Based Access Control (RBAC) Permissions Inspector */}
      <Card>
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Ruxsatlar & Huquqlar (RBAC)
        </h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Joriy rol:
            </span>
            {role && <Badge role={role}>{ROLE_LABELS[role]}</Badge>}
          </div>

          {role && (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              {ROLE_DESCRIPTIONS[role]}
            </p>
          )}

          <div className="pt-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
              Berilgan ruxsatlar ({activePermissions.length} ta):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activePermissions.map((perm) => (
                <span
                  key={perm}
                  className="px-2.5 py-1 text-[11px] font-mono font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700"
                >
                  {perm}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* 4. Notifications */}
      <Card>
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Bildirishnomalar
        </h3>
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Email Bildirishnomalari
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Yangi baholar, dars o‘zgarishlari va hisob xabarlari haqida xabar olish
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={emailAlerts}
            onChange={(e) => {
              setEmailAlerts(e.target.checked);
              toast.info('Bildirishnoma', 'Sozlama saqlandi');
            }}
            className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
          />
        </div>
      </Card>
    </PageTransition>
  );
};
