import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth, DEMO_CREDENTIALS } from '../../context/AuthContext';
import { useToast } from '../../design-system/components/Toast';
import { UserRole, ROLE_LABELS } from '@ems/shared';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';
import { GraduationCap, Mail, Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, quickLoginAs, isLoading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Iltimos, barcha maydonlarni to‘ldiring');
      return;
    }

    try {
      await login({ email, password });
      toast.success('Xush kelibsiz!', 'EMS tizimiga muvaffaqiyatli kirdingiz');
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Kirishda xatolik yuz berdi');
      } else {
        setError('Tizimga kirishda kutilmagan xatolik yuz berdi');
      }
    }
  };

  const handleQuickLogin = async (role: UserRole) => {
    setError(null);
    setEmail(DEMO_CREDENTIALS[role].email);
    setPassword(DEMO_CREDENTIALS[role].pass);
    try {
      await quickLoginAs(role);
      toast.success('Demo Kirish', `${ROLE_LABELS[role]} sifatida muvaffaqiyatli kirdingiz`);
      navigate('/dashboard');
    } catch {
      setError('Tezkor kirishda xatolik yuz berdi');
    }
  };

  const demoRoles: UserRole[] = [
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.TEACHER,
    UserRole.STUDENT,
    UserRole.PARENT,
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        {/* Left Side: Brand & Quick Demo Access */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-8 sm:p-10 text-white flex flex-col justify-between text-left">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/30">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white">EMS Platform</h1>
                <p className="text-xs text-indigo-300 font-semibold">Enterprise SaaS Platform</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold leading-tight tracking-tight">
                Kelajak ta’limini bugun boshqaring.
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Super Admin, Maktab ma’muriyati, O‘qituvchilar, O‘quvchilar va Ota-onalar uchun
                yagona professional boshqaruv tizimi.
              </p>
            </div>

            {/* Quick Demo Selector */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bir bosishda kirish (Demo Rollar):</span>
              </div>
              <div className="space-y-2">
                {demoRoles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleQuickLogin(r)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-900/80 hover:bg-indigo-600/40 border border-slate-800 hover:border-indigo-500/50 rounded-xl text-xs font-semibold transition-all group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
                      <span>{ROLE_LABELS[r]}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/60 text-[11px] text-slate-400">
            © 2026 EMS Platform. Barcha huquqlar himoyalangan.
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center text-left">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Tizimga kirish
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Hisobingiz ma’lumotlarini kiritib platformaga kiring
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Elektron pochta"
                type="email"
                placeholder="masalan: superadmin@ems.local"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Input
                label="Parol"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Eslab qolish</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    toast.info('Parol', 'Parolni tiklash uchun administrator bilan bog‘laning')
                  }
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                >
                  Parolni unutdingizmi?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                Platformaga kirish
              </Button>
            </form>

            <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
              Yangi hisob kerakmi?{' '}
              <span className="text-slate-800 dark:text-slate-200 font-semibold">
                Maktab ma’muriyati orqali ro‘yxatdan o‘tiladi
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
