import React from 'react';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import { Badge } from '../../design-system/components/Badge';
import { useToast } from '../../design-system/components/Toast';
import { PageTransition } from '../../design-system/motion/PageTransition';
import { Download } from 'lucide-react';

export const GradesPage: React.FC = () => {
  const toast = useToast();

  const gradeItems = [
    {
      subject: 'Dasturlash Asoslari & Algoritmlar',
      teacher: 'Bobur Mirzayev',
      midterm: 94,
      final: 98,
      homework: 95,
      total: 96,
      grade: 'A',
    },
    {
      subject: 'Oliy Matematika va Algebra',
      teacher: 'Bobur Mirzayev',
      midterm: 88,
      final: 92,
      homework: 85,
      total: 89,
      grade: 'B+',
    },
    {
      subject: 'Akademik Ingliz Tili',
      teacher: 'Malika Raximova',
      midterm: 90,
      final: 95,
      homework: 92,
      total: 93,
      grade: 'A',
    },
    {
      subject: 'Kiberxavfsizlik Kirish',
      teacher: 'Bobur Mirzayev',
      midterm: 85,
      final: 87,
      homework: 90,
      total: 87,
      grade: 'B',
    },
  ];

  return (
    <PageTransition className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Akademik Baholar Daftari
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Joriy semestrdagi barcha fanlar oraliq, yakuniy va jami ballari
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<Download className="w-4 h-4" />}
          onClick={() => toast.success('Yuklab olindi', 'Baholar vedomosti (Transkript) saqlandi')}
        >
          Transkript Yuklab Olish
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-4">Fan Nomi</th>
                <th className="py-3 px-4">O‘qituvchi</th>
                <th className="py-3 px-4">Oraliq Nazorat</th>
                <th className="py-3 px-4">Uy Vazifalari</th>
                <th className="py-3 px-4">Yakuniy Imtihon</th>
                <th className="py-3 px-4">Jami Ball</th>
                <th className="py-3 px-4 text-center">Harfiy Baho</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {gradeItems.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                    {item.subject}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{item.teacher}</td>
                  <td className="py-3.5 px-4 font-mono">{item.midterm} / 100</td>
                  <td className="py-3.5 px-4 font-mono">{item.homework} / 100</td>
                  <td className="py-3.5 px-4 font-mono">{item.final} / 100</td>
                  <td className="py-3.5 px-4 font-extrabold text-indigo-600 dark:text-indigo-400">
                    {item.total} ball
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge variant={item.grade.startsWith('A') ? 'success' : 'purple'}>
                      {item.grade}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageTransition>
  );
};
