import React, { useState } from 'react';
import { StatsCard } from '../../../components/common/StatsCard';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
import { BookOpen, Users, CheckSquare, Clock, PlusCircle, Award } from 'lucide-react';
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
    setStudentName('');
    setScore('');
    setIsGradeModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            O‘qituvchi Ishchi Maydoni
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Darslar, o‘quvchilar davomati va akademik baholash tizimi
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Biriktirilgan Kurslar"
          value="4 ta fan"
          icon={<BookOpen className="w-5 h-5" />}
          subtitle="Dasturlash & Algoritmlar"
          color="indigo"
        />
        <StatsCard
          title="Jami O‘quvchilarim"
          value="128 nafar"
          icon={<Users className="w-5 h-5" />}
          trend={{ value: '100% faol', isPositive: true }}
          color="emerald"
        />
        <StatsCard
          title="Tekshirilmagan Vazifalar"
          value="14 ta"
          icon={<CheckSquare className="w-5 h-5" />}
          subtitle="Bugun topshirilgan"
          color="amber"
        />
        <StatsCard
          title="O‘rtacha O‘zlashtirish"
          value="84.6 ball"
          icon={<Award className="w-5 h-5" />}
          trend={{ value: '+3.2%', isPositive: true }}
          color="purple"
        />
      </div>

      {/* Schedule and Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-7">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">Bugungi Dars Jadvali</h3>
            <span className="text-xs font-semibold text-slate-500">Seshanba, 2026</span>
          </div>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-indigo-950">
                  Dasturlash Asoslari: Algoritmlar
                </p>
                <p className="text-[11px] text-indigo-700 mt-0.5">
                  Xona: IT-Laboratoriya 3 • 9-A sinf
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-900">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  09:00 - 10:30
                </span>
                <span className="block text-[10px] text-emerald-600 font-medium">Bajarildi</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Ma’lumotlar Tuzilmasi & OOP</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Xona: Bino A, 204 • 10-B sinf</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  11:00 - 12:30
                </span>
                <span className="block text-[10px] text-indigo-600 font-medium">Kutilmoqda</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Grade Distribution Chart */}
        <Card className="lg:col-span-5">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900">Baholar Taqsimoti</h3>
            <p className="text-xs text-slate-500">O‘quvchilarning umumiy baho statistikasi</p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={gradeDistribution}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="grade" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} name="O‘quvchilar soni" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Grades Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">So‘nggi Qo‘yilgan Baholar</h3>
          <span className="text-xs text-slate-500">{grades.length} ta baho kiritildi</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                <th className="py-2.5 px-3">O‘quvchi</th>
                <th className="py-2.5 px-3">Fan</th>
                <th className="py-2.5 px-3">Nazorat Turi</th>
                <th className="py-2.5 px-3">Baho / Ball</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {grades.map((g) => (
                <tr key={g.id}>
                  <td className="py-3 px-3 font-semibold text-slate-900">{g.student}</td>
                  <td className="py-3 px-3">{g.course}</td>
                  <td className="py-3 px-3">{g.type}</td>
                  <td className="py-3 px-3 font-bold text-indigo-600">{g.score} ball</td>
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              O‘quvchi Ism-Familiyasi
            </label>
            <input
              type="text"
              placeholder="Masalan: Alisher Sobirov"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ball (0 - 100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="95"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-3">
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
    </div>
  );
};
