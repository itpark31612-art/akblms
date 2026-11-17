import React from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Download } from 'lucide-react';

export const GradesPage: React.FC = () => {
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Akademik Baholar Daftari
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Joriy semestrdagi barcha fanlar oraliq, yakuniy va jami ballari
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<Download className="w-4 h-4" />}
          onClick={() => alert('Baholar vedomosti (Transcript) yuklab olindi')}
        >
          Transkript Yuklab Olish
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-4">Fan Nomi</th>
                <th className="py-3 px-4">O‘qituvchi</th>
                <th className="py-3 px-4">Oraliq Nazorat</th>
                <th className="py-3 px-4">Uy Vazifalari</th>
                <th className="py-3 px-4">Yakuniy Imtihon</th>
                <th className="py-3 px-4">Jami Ball</th>
                <th className="py-3 px-4 text-center">Harfiy Baho</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {gradeItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{item.subject}</td>
                  <td className="py-3.5 px-4 text-slate-500">{item.teacher}</td>
                  <td className="py-3.5 px-4 font-mono">{item.midterm} / 100</td>
                  <td className="py-3.5 px-4 font-mono">{item.homework} / 100</td>
                  <td className="py-3.5 px-4 font-mono">{item.final} / 100</td>
                  <td className="py-3.5 px-4 font-bold text-indigo-600">{item.total} ball</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {item.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
