import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from '../../components/common/Charts';
import { Download, RefreshCw } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState('OYLIK');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const attendanceData = [
    { name: '1-Hafta', darsda: 96, kelmagan: 4 },
    { name: '2-Hafta', darsda: 94, kelmagan: 6 },
    { name: '3-Hafta', darsda: 97, kelmagan: 3 },
    { name: '4-Hafta', darsda: 93, kelmagan: 7 },
  ];

  const gradeBreakdown = [
    { subject: 'Dasturlash', avg: 89, max: 100 },
    { subject: 'Matematika', avg: 82, max: 100 },
    { subject: 'Fizika', avg: 78, max: 100 },
    { subject: 'Ingliz tili', avg: 91, max: 100 },
    { subject: 'Tarix', avg: 85, max: 100 },
  ];

  const distributionPie = [
    { name: 'STEM Fanlari', value: 45, color: '#4f46e5' },
    { name: 'Gumanitar', value: 25, color: '#10b981' },
    { name: 'Xorijiy Tillar', value: 20, color: '#f59e0b' },
    { name: 'San’at & Sport', value: 10, color: '#8b5cf6' },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Akademik Analitika & Hisobotlar
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Recharts interaktiv vizualizatsiyasi: Davomat, o‘zlashtirish va yo‘nalishlar balansi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs">
            {['HAFTALIK', 'OYLIK', 'SEMESTR'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  period === p ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
            onClick={handleRefresh}
          >
            Yangilash
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => alert('Analitika hisoboti PDF formatida yuklab olindi')}
          >
            Eksport
          </Button>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance Area */}
        <Card className="lg:col-span-8">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900">
              Davomat Barqarorligi Dinamikasi (%)
            </h3>
            <p className="text-xs text-slate-500">Talabalarning darslarga qatnashish foizi</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={attendanceData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[80, 100]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="darsda"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#attendGrad)"
                  name="Qatnashganlar (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Courses Pie */}
        <Card className="lg:col-span-4 flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="text-base font-semibold text-slate-900">Yo‘nalishlar Ulushi</h3>
            <p className="text-xs text-slate-500">Akademik dasturlarning mutanosibligi</p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  paddingAngle={4}
                >
                  {distributionPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
            {distributionPie.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: d.color }}
                ></span>
                <span className="text-slate-600 truncate">
                  {d.name} ({d.value}%)
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Grade Breakdown by Subjects */}
      <Card>
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-900">
            Fanlar Kesimida O‘rtacha Akademik Ko‘rsatkich
          </h3>
          <p className="text-xs text-slate-500">Maksimal 100 ball shkalasi bo‘yicha</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gradeBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="avg" fill="#4f46e5" radius={[6, 6, 0, 0]} name="O‘rtacha Ball" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
