import React, { useState } from 'react';
import { Card } from '../../../design-system/components/Card';
import { Button } from '../../../design-system/components/Button';
import { Modal } from '../../../design-system/components/Modal';
import { Badge } from '../../../design-system/components/Badge';
import { useToast } from '../../../design-system/components/Toast';
import { PageTransition } from '../../../design-system/motion/PageTransition';
import { CounterAnimation } from '../../../design-system/motion/CounterAnimation';
import { StaggerContainer, StaggerItem } from '../../../design-system/motion/StaggerAnimation';
import {
  Users,
  GraduationCap,
  Building2,
  Server,
  Plus,
  RefreshCw,
  Download,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from '../../../components/common/Charts';

export const SuperAdminDashboardView: React.FC = () => {
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');
  const [schools, setSchools] = useState([
    {
      id: '1',
      name: 'Toshkent Xalqaro Akademiyasi',
      code: 'SCH-001',
      students: 840,
      status: 'Faol',
    },
    {
      id: '2',
      name: 'Samarqand IT & STEM Maktabi',
      code: 'SCH-002',
      students: 620,
      status: 'Faol',
    },
    { id: '3', name: 'Buxoro Muhandislik Litseyi', code: 'SCH-003', students: 490, status: 'Faol' },
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const monthlyData = [
    { month: 'Yan', students: 450, teachers: 35 },
    { month: 'Fev', students: 680, teachers: 52 },
    { month: 'Mar', students: 920, teachers: 70 },
    { month: 'Apr', students: 1250, teachers: 95 },
    { month: 'May', students: 1680, teachers: 130 },
    { month: 'Iyun', students: 1950, teachers: 160 },
  ];

  const serverLoadData = [
    { time: '00:00', cpu: 15, memory: 38 },
    { time: '04:00', cpu: 12, memory: 36 },
    { time: '08:00', cpu: 48, memory: 55 },
    { time: '12:00', cpu: 75, memory: 68 },
    { time: '16:00', cpu: 65, memory: 62 },
    { time: '20:00', cpu: 32, memory: 45 },
  ];

  const handleAddSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName.trim()) return;
    const newSchool = {
      id: String(Date.now()),
      name: newSchoolName.trim(),
      code: `SCH-00${schools.length + 1}`,
      students: 0,
      status: 'Faol',
    };
    setSchools([...schools, newSchool]);
    setNewSchoolName('');
    setIsModalOpen(false);
    toast.success('Muvaffaqiyatli', `${newSchool.name} tizimga qo‘shildi`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.info('Yangilandi', 'Barcha ko‘rsatkichlar real vaqt rejimida yangilandi');
    }, 500);
  };

  return (
    <PageTransition className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Super Admin Boshqaruv Markazi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global ta’lim infratuzilmasi, tarmoq resurslari va server monitoringi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
            onClick={handleRefresh}
          >
            Yangilash
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => toast.success('Eksport qilindi', 'Hisobot yuklab olindi')}
          >
            Eksport
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Yangi Filial
          </Button>
        </div>
      </div>

      {/* Stats Cards with CounterAnimation and Stagger */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StaggerItem>
          <Card hover accent="indigo" className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Jami Foydalanuvchilar
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={2450} />
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>+14% bu oyda</span>
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card hover accent="emerald" className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Faol O‘quvchilar
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={1950} />
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>+18% yangi qabul</span>
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card hover accent="purple" className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Ta’lim Muassasalari
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={schools.length} />
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              100% faol filiallar
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card hover accent="indigo" className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Server Ishonchliligi
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={99.99} decimals={2} suffix="%" />
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400">
                <Server className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              Latency: 22ms (Optimal)
            </div>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Platforma O‘sish Dinamikasi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Oylar kesimida talabalar va pedagoglar soni
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />{' '}
                O‘quvchilar
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> O‘qituvchilar
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="studentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="teacherGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#334155"
                  opacity={0.2}
                />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#studentGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="teachers"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#teacherGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-4 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Server Yuklamasi (%)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              So‘nggi 24 soatlik CPU va Xotira
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serverLoadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#334155"
                  opacity={0.2}
                />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="cpu" fill="#6366f1" radius={[4, 4, 0, 0]} name="CPU (%)" />
                <Bar dataKey="memory" fill="#94a3b8" radius={[4, 4, 0, 0]} name="RAM (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Schools List */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Ta’lim Muassasalari Ro‘yxati
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ulangan maktablar va ularning faol o‘quvchilar soni
            </p>
          </div>
          <Badge variant="purple">{schools.length} ta faol filial</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-4">Muassasa Nomi</th>
                <th className="py-3 px-4">Kodi</th>
                <th className="py-3 px-4">O‘quvchilar</th>
                <th className="py-3 px-4">Holat</th>
                <th className="py-3 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              {schools.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {s.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                    {s.code}
                  </td>
                  <td className="py-3.5 px-4 font-semibold">{s.students} nafar</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success" dot>
                      {s.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast.info('Boshqaruv', `${s.name} profili ochildi`)}
                    >
                      Boshqarish
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add School Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yangi Filial / Maktab Qo‘shish"
        description="EMS ta’lim tarmog‘iga yangi muassasa biriktirish"
      >
        <form onSubmit={handleAddSchool} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Muassasa To‘liq Nomi
            </label>
            <input
              type="text"
              placeholder="Masalan: Farg‘ona IT-Akademiyasi"
              value={newSchoolName}
              onChange={(e) => setNewSchoolName(e.target.value)}
              className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 focus:border-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Saqlash & Faollashtirish
            </Button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
};
