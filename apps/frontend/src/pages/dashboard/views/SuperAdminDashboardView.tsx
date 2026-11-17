import React, { useState } from 'react';
import { StatsCard } from '../../../components/common/StatsCard';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import {
  Users,
  GraduationCap,
  Building2,
  Server,
  Plus,
  RefreshCw,
  Download,
  CheckCircle,
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
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleExportReport = () => {
    alert('Tizim hisoboti (PDF / CSV) muvaffaqiyatli shakllantirildi va yuklab olindi.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Super Admin Boshqaruv Markazi
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            EMS ta’lim tarmog‘ining global infratuzilmasi va resurslari nazorati
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
            onClick={handleExportReport}
          >
            Eksport
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Yangi Filial / Maktab
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Jami Foydalanuvchilar"
          value="2,450"
          icon={<Users className="w-5 h-5" />}
          trend={{ value: '+14% o‘sish', isPositive: true }}
          color="indigo"
        />
        <StatsCard
          title="Faol O‘quvchilar"
          value="1,950"
          icon={<GraduationCap className="w-5 h-5" />}
          trend={{ value: '+18% yangi', isPositive: true }}
          color="emerald"
        />
        <StatsCard
          title="Ta’lim Muassasalari"
          value={schools.length}
          icon={<Building2 className="w-5 h-5" />}
          subtitle="Barcha filiallar faol"
          color="purple"
        />
        <StatsCard
          title="Server Ishonchliligi"
          value="99.99%"
          icon={<Server className="w-5 h-5" />}
          subtitle="Latency: 24ms (Optimal)"
          color="blue"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Growth Area Chart */}
        <Card className="lg:col-span-8 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Platforma O‘sish Dinamikasi
              </h3>
              <p className="text-xs text-slate-500">
                Oylar kesimida talabalar va o‘qituvchilar soni
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-indigo-600 font-medium">
                <span className="w-3 h-3 rounded-full bg-indigo-600"></span> O‘quvchilar
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span> O‘qituvchilar
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
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

        {/* Server Health Bar Chart */}
        <Card className="lg:col-span-4 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900">Server Yuklamasi (%)</h3>
            <p className="text-xs text-slate-500">So‘nggi 24 soatlik CPU va Xotira</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serverLoadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="cpu" fill="#6366f1" radius={[4, 4, 0, 0]} name="CPU Yuklamasi" />
                <Bar dataKey="memory" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Xotira (RAM)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Schools / Branches List */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Tizimdagi Ta’lim Muassasalari
            </h3>
            <p className="text-xs text-slate-500">
              Ushbu platformaga ulangan maktablar va filiallar
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
            {schools.length} ta filial faol
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-4">Muassasa Nomi</th>
                <th className="py-3 px-4">Kodi</th>
                <th className="py-3 px-4">O‘quvchilar Soni</th>
                <th className="py-3 px-4">Holati</th>
                <th className="py-3 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {schools.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {s.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{s.code}</td>
                  <td className="py-3.5 px-4">{s.students} nafar</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => alert(`${s.name} sozlamalari ko‘rib chiqildi.`)}
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
        title="Yangi Maktab / Filial Qo‘shish"
        description="EMS tarmog‘iga yangi ta’lim binosini ro‘yxatdan o‘tkazing"
      >
        <form onSubmit={handleAddSchool} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Muassasa To‘liq Nomi
            </label>
            <input
              type="text"
              placeholder="Masalan: Farg‘ona Prezident Maktabi Filiali"
              value={newSchoolName}
              onChange={(e) => setNewSchoolName(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Saqlash & Faollashtirish
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
