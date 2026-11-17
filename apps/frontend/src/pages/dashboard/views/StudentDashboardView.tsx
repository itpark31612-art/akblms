import React, { useState } from 'react';
import { StatsCard } from '../../../components/common/StatsCard';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { BookOpen, Award, CalendarCheck, Clock, CheckCircle2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from '../../../components/common/Charts';

export const StudentDashboardView: React.FC = () => {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Algoritmlar: Binary Search Tree laboratoriyasi',
      deadline: 'Bugun, 23:59',
      done: false,
    },
    {
      id: '2',
      title: 'Matematika: Hosilalar bo‘yicha hisob-kitob',
      deadline: 'Ertaga, 12:00',
      done: true,
    },
    {
      id: '3',
      title: 'Fizika: Termodinamika masalalar to‘plami',
      deadline: '20-Noyabr',
      done: false,
    },
  ]);

  const performanceTrend = [
    { subject: 'Matematika', score: 92 },
    { subject: 'Fizika', score: 85 },
    { subject: 'Dasturlash', score: 98 },
    { subject: 'Ingliz tili', score: 89 },
    { subject: 'Tarix', score: 84 },
  ];

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Xush kelibsiz, Alisher! 🎓
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            9-A sinf o‘quvchisi • Akademik natijalar va topshiriqlaringiz tahlili
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Dars jadvali PDF formatida yuklab olindi')}
          >
            Dars Jadvalini Yuklab Olish
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Joriy GPA Ko‘rsatkichi"
          value="3.86"
          icon={<Award className="w-5 h-5" />}
          trend={{ value: 'A+ A’lo', isPositive: true }}
          color="indigo"
        />
        <StatsCard
          title="Davomat Ko‘rsatkichi"
          value="97.2%"
          icon={<CalendarCheck className="w-5 h-5" />}
          trend={{ value: '+1.5%', isPositive: true }}
          color="emerald"
        />
        <StatsCard
          title="O‘rganilayotgan Fanlar"
          value="6 ta kurs"
          icon={<BookOpen className="w-5 h-5" />}
          subtitle="Barcha darslar faol"
          color="purple"
        />
        <StatsCard
          title="Kutilayotgan Topshiriqlar"
          value={tasks.filter((t) => !t.done).length}
          icon={<Clock className="w-5 h-5" />}
          subtitle="Topshirish muddati yaqin"
          color="amber"
        />
      </div>

      {/* Performance & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subject Performance Chart */}
        <Card className="lg:col-span-7">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900">
              Fanlar Kesimida O‘zlashtirish Ballari
            </h3>
            <p className="text-xs text-slate-500">Maksimal 100 ball shkalasi bo‘yicha</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceTrend}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} name="To‘plangan Ball" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Tasks Checklist */}
        <Card className="lg:col-span-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">Mening Uy Vazifalarim</h3>
            <span className="text-xs text-slate-500">
              {tasks.filter((t) => t.done).length}/{tasks.length} bajarildi
            </span>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  task.done
                    ? 'bg-slate-50 border-slate-200 text-slate-400'
                    : 'bg-white border-slate-200/80 hover:border-indigo-300 text-slate-800'
                }`}
              >
                <button
                  type="button"
                  className={`mt-0.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                    task.done ? 'text-emerald-500' : 'text-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <div className="flex-1">
                  <p
                    className={`text-xs font-semibold ${task.done ? 'line-through text-slate-400' : ''}`}
                  >
                    {task.title}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-0.5 block flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Muddat: {task.deadline}
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
