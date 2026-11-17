import React, { useState } from 'react';
import { Card } from '../../../design-system/components/Card';
import { Button } from '../../../design-system/components/Button';
import { Modal } from '../../../design-system/components/Modal';
import { Badge } from '../../../design-system/components/Badge';
import { useToast } from '../../../design-system/components/Toast';
import { PageTransition } from '../../../design-system/motion/PageTransition';
import { CounterAnimation } from '../../../design-system/motion/CounterAnimation';
import { StaggerContainer, StaggerItem } from '../../../design-system/motion/StaggerAnimation';
import { BookOpen, Users, CheckSquare, Clock, PlusCircle, Award, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from '../../../components/common/Charts';

export const TeacherDashboardView: React.FC = () => {
  const toast = useToast();
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [score, setScore] = useState('');
  const [grades, setGrades] = useState([
    {
      id: '1',
      student: 'Alisher Sobirov',
      course: 'Dasturlash Asoslari',
      score: 95,
      type: 'Imtihon',
    },
    { id: '2', student: 'Madina Karimova', course: 'Algoritmlar', score: 88, type: 'Oraliq' },
  ]);

  const gradeDistribution = [
    { grade: 'A (90-100)', count: 28 },
    { grade: 'B (80-89)', count: 45 },
    { grade: 'C (70-79)', count: 22 },
    { grade: 'D (60-69)', count: 8 },
    { grade: 'F (<60)', count: 2 },
  ];

  const handleAddGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !score) return;
    setGrades([
      {
        id: String(Date.now()),
        student: studentName,
        course: 'Dasturlash Asoslari',
        score: Number(score),
        type: 'Vazifa',
      },
      ...grades,
    ]);
    toast.success('Baho saqlandi', `${studentName} ga ${score} ball qo‘yildi`);
    setStudentName('');
    setScore('');
    setIsGradeModalOpen(false);
  };

  return (
    <PageTransition className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            O‘qituvchi Ishchi Maydoni
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Darslar jadvali, o‘quvchilar davomati va akademik baholash tizimi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<PlusCircle className="w-4 h-4" />}
            onClick={() => setIsGradeModalOpen(true)}
          >
            Baho Qo‘yish
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
                  Fanlarim
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={4} suffix=" ta fan" />
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              Dasturlash & Algoritmlar
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card hover accent="emerald" className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  O‘quvchilarim
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={128} suffix=" nafar" />
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>100% faol ishtirok</span>
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card hover accent="amber" className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Kutilayotgan Vazifalar
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={14} suffix=" ta" />
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
                <CheckSquare className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              Bugun tekshirilishi kerak
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card hover accent="purple" className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  O‘rtacha Ball
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={84.6} decimals={1} suffix=" ball" />
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>+3.2% o‘zlashtirish</span>
            </div>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* Schedule and Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Bugungi Dars Jadvali
            </h3>
            <Badge variant="neutral">Seshanba, 2026</Badge>
          </div>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                  Dasturlash Asoslari: Algoritmlar
                </p>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-400 mt-0.5">
                  Xona: IT-Laboratoriya 3 • 9-A sinf
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-900 dark:text-indigo-300">
                  <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  09:00 - 10:30
                </span>
                <Badge variant="success" size="sm" className="mt-1 block">
                  Bajarildi
                </Badge>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Ma’lumotlar Tuzilmasi & OOP
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Xona: Bino A, 204 • 10-B sinf
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  11:00 - 12:30
                </span>
                <Badge variant="neutral" size="sm" className="mt-1 block">
                  Kutilmoqda
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-5">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Baholar Taqsimoti
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              O‘quvchilarning umumiy baho statistikasi
            </p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={gradeDistribution}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#334155"
                  opacity={0.2}
                />
                <XAxis dataKey="grade" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="O‘quvchilar soni" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Grades Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            So‘nggi Qo‘yilgan Baholar
          </h3>
          <Badge variant="purple">{grades.length} ta kiritildi</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                <th className="py-2.5 px-3">O‘quvchi</th>
                <th className="py-2.5 px-3">Fan</th>
                <th className="py-2.5 px-3">Nazorat Turi</th>
                <th className="py-2.5 px-3">Baho</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {grades.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">
                    {g.student}
                  </td>
                  <td className="py-3 px-3">{g.course}</td>
                  <td className="py-3 px-3">{g.type}</td>
                  <td className="py-3 px-3 font-extrabold text-indigo-600 dark:text-indigo-400">
                    {g.score} ball
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Grade Modal */}
      <Modal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        title="O‘quvchiga Baho Qo‘yish"
        description="Fanning oraliq nazorati yoki vazifa bahosini kiriting"
      >
        <form onSubmit={handleAddGrade} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              O‘quvchi Ism-Familiyasi
            </label>
            <input
              type="text"
              placeholder="Masalan: Alisher Sobirov"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Ball (0 - 100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="95"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 focus:border-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsGradeModalOpen(false)}
            >
              Bekor qilish
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Bahoni Saqlash
            </Button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
};
