import React, { useState } from 'react';
import { Card } from '../../../design-system/components/Card';
import { Button } from '../../../design-system/components/Button';
import { Badge } from '../../../design-system/components/Badge';
import { useToast } from '../../../design-system/components/Toast';
import { PageTransition } from '../../../design-system/motion/PageTransition';
import { CounterAnimation } from '../../../design-system/motion/CounterAnimation';
import { StaggerContainer, StaggerItem } from '../../../design-system/motion/StaggerAnimation';
import {
  Users,
  GraduationCap,
  BookOpen,
  Clock,
  CalendarCheck,
  UserPlus,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from '../../../components/common/Charts';

export const AdminDashboardView: React.FC = () => {
  const toast = useToast();
  const [selectedClass] = useState('9-A');

  const attendanceData = [
    { day: 'Dush', kelgan: 95, kelmagan: 5 },
    { day: 'Sesh', kelgan: 93, kelmagan: 7 },
    { day: 'Chor', kelgan: 96, kelmagan: 4 },
    { day: 'Pay', kelgan: 91, kelmagan: 9 },
    { day: 'Jum', kelgan: 98, kelmagan: 2 },
    { day: 'Shan', kelgan: 89, kelmagan: 11 },
  ];

  const recentApplications = [
    {
      id: '1',
      studentName: 'Javohir Toshmatov',
      grade: '9-A',
      date: 'Bugun, 10:20',
      status: 'Kutilmoqda',
    },
    {
      id: '2',
      studentName: 'Fotima Ergasheva',
      grade: '10-B',
      date: 'Kecha, 16:45',
      status: 'Tasdiqlangan',
    },
    {
      id: '3',
      studentName: 'Zuhra Ergasheva',
      grade: '10-B',
      date: 'Kecha, 16:45',
      status: 'Tasdiqlangan',
    },
  ];

  return (
    <PageTransition className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Maktab Ma’muriyati Paneli
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Toshkent Xalqaro Akademiyasi: O‘quv jarayonlari, davomat va pedagoglar tarkibi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('Filtr', `Hozirgi sinf: ${selectedClass}`)}
          >
            Sinf bo‘yicha filtr
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<UserPlus className="w-4 h-4" />}
            onClick={() => toast.success('Yangi Qabul', 'O‘quvchi qabul anketasi ochildi')}
          >
            Yangi Qabul
          </Button>
        </div>
      </div>

      {/* Stats with CounterAnimation */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StaggerItem>
          <Card hover accent="indigo" className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  O‘quvchilar
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={840} />
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>+42 bu semestr</span>
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card hover accent="emerald" className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Pedagoglar
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={58} />
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              100% oliy toifali
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card hover accent="purple" className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Fanlar & Kurslar
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={34} />
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              STEM va Gumanitar
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card hover accent="indigo" className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Haftalik Davomat
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={94.6} decimals={1} suffix="%" />
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>+2.1% o‘sish</span>
            </div>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* Charts & Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Haftalik Davomat Tahlili (%)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Maktab bo‘yicha umumiy ishtirok darajasi
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Kelgan
              </span>
              <span className="flex items-center gap-1.5 text-rose-500 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Kelmagan
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#334155"
                  opacity={0.2}
                />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="kelgan" fill="#10b981" radius={[4, 4, 0, 0]} name="Kelgan (%)" />
                <Bar dataKey="kelmagan" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Kelmagan (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Yangi Qabul Arizalari
            </h3>
            <Badge variant="purple">3 ta yangi</Badge>
          </div>
          <div className="space-y-3">
            {recentApplications.map((app) => (
              <div
                key={app.id}
                className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {app.studentName}
                  </p>
                  <Badge
                    variant={app.status === 'Kutilmoqda' ? 'warning' : 'success'}
                    size="sm"
                    dot
                  >
                    {app.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  <span>Sinf: {app.grade}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {app.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageTransition>
  );
};
