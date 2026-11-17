import React, { useState } from 'react';
import { Card } from '../../../design-system/components/Card';
import { Button } from '../../../design-system/components/Button';
import { Badge } from '../../../design-system/components/Badge';
import { useToast } from '../../../design-system/components/Toast';
import { PageTransition } from '../../../design-system/motion/PageTransition';
import { CounterAnimation } from '../../../design-system/motion/CounterAnimation';
import { StaggerContainer, StaggerItem } from '../../../design-system/motion/StaggerAnimation';
import { fireGamificationConfetti } from '../../../design-system/motion/motionPresets';
import {
  BookOpen,
  Award,
  CalendarCheck,
  Clock,
  CheckCircle2,
  Sparkles,
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

export const StudentDashboardView: React.FC = () => {
  const toast = useToast();
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

  const toggleTask = (id: string, e: React.MouseEvent) => {
    const target = tasks.find((t) => t.id === id);
    const newDone = !target?.done;

    if (newDone) {
      // Yutuq effekti: Confetti otish!
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      fireGamificationConfetti({ x, y });
      toast.success('Ajoyib!', `Topshiriq muvaffaqiyatli bajarildi: "${target?.title}"`);
    }

    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: newDone } : t)));
  };

  return (
    <PageTransition className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Xush kelibsiz, Alisher!
            </h2>
            <Sparkles className="w-5 h-5 text-amber-500 animate-bounce" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            9-A sinf o‘quvchisi • Akademik natijalar, topshiriqlar va gamifikatsiya yutuqlari
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Yuklab olindi', 'Dars jadvali PDF shaklida saqlandi')}
          >
            Dars Jadvalini Yuklab Olish
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
                  Joriy GPA
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={3.86} decimals={2} />
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>A+ A’lo natija</span>
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card hover accent="emerald" className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Davomat
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={97.2} decimals={1} suffix="%" />
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>+1.5% bu oyda</span>
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card hover accent="purple" className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Mening Fanlarim
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={6} suffix=" ta kurs" />
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              Barcha darslar faol
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card hover accent="amber" className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Qolgan Topshiriqlar
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={tasks.filter((t) => !t.done).length} />
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              Topshirish muddati yaqin
            </div>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* Charts & Interactive Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Fanlar Kesimida O‘zlashtirish Ballari
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Maksimal 100 ball shkalasi bo‘yicha
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceTrend}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#334155"
                  opacity={0.2}
                />
                <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} name="To‘plangan Ball" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Tasks Checklist with Gamification Confetti */}
        <Card className="lg:col-span-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Mening Uy Vazifalarim
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bajarilgach ustiga bosing (Confetti!)
              </p>
            </div>
            <Badge variant="purple">
              {tasks.filter((t) => t.done).length}/{tasks.length} bajarildi
            </Badge>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={(e) => toggleTask(task.id, e)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                  task.done
                    ? 'bg-slate-50/60 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                    : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 text-slate-800 dark:text-slate-200 shadow-2xs'
                }`}
              >
                <button
                  type="button"
                  className={`mt-0.5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    task.done ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <div className="flex-1 text-left">
                  <p
                    className={`text-xs font-bold leading-snug ${
                      task.done ? 'line-through text-slate-400 dark:text-slate-500' : ''
                    }`}
                  >
                    {task.title}
                  </p>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" />
                    Muddat: {task.deadline}
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
