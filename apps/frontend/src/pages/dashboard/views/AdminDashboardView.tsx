import React, { useState } from 'react';
import { StatsCard } from '../../../components/common/StatsCard';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import {
  Users,
  GraduationCap,
  BookOpen,
  Clock,
  CalendarCheck,
  UserPlus,
  Filter,
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
  const [selectedClass] = useState('Barchasi');

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Maktab Ma’muriyati Paneli
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Toshkent Xalqaro Akademiyasi: O‘quv jarayonlari, davomat va pedagoglar tarkibi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Filter className="w-4 h-4" />}
            onClick={() => alert(`Sinflar filtri: ${selectedClass}`)}
          >
            Sinf bo‘yicha filtr
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<UserPlus className="w-4 h-4" />}
            onClick={() => alert('Yangi o‘quvchi qabul qilish arizasi ochildi')}
          >
            Yangi Qabul
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="O‘quvchilar Kontingenti"
          value="840"
          icon={<GraduationCap className="w-5 h-5" />}
          trend={{ value: '+42 bu semestr', isPositive: true }}
          color="indigo"
        />
        <StatsCard
          title="Pedagogik Jamoa"
          value="58"
          icon={<Users className="w-5 h-5" />}
          subtitle="100% oliy toifali"
          color="emerald"
        />
        <StatsCard
          title="Faol Kurslar & Fanlar"
          value="34"
          icon={<BookOpen className="w-5 h-5" />}
          subtitle="STEM va Gumanitar"
          color="purple"
        />
        <StatsCard
          title="O‘rtacha Haftalik Davomat"
          value="94.6%"
          icon={<CalendarCheck className="w-5 h-5" />}
          trend={{ value: '+2.1%', isPositive: true }}
          color="blue"
        />
      </div>

      {/* Charts & Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance Chart */}
        <Card className="lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Haftalik Davomat Tahlili (%)
              </h3>
              <p className="text-xs text-slate-500">Maktab bo‘yicha umumiy ishtirok darajasi</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Darsda qatnashgan
              </span>
              <span className="flex items-center gap-1.5 text-rose-500 font-medium">
                <span className="w-3 h-3 rounded-full bg-rose-400"></span> Kelmagan
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="kelgan" fill="#10b981" radius={[4, 4, 0, 0]} name="Kelgan (%)" />
                <Bar dataKey="kelmagan" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Kelmagan (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Applications */}
        <Card className="lg:col-span-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">Yangi Qabul Arizalari</h3>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              3 ta yangi
            </span>
          </div>
          <div className="space-y-3">
            {recentApplications.map((app) => (
              <div
                key={app.id}
                className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-900">{app.studentName}</p>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      app.status === 'Kutilmoqda'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
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
    </div>
  );
};
