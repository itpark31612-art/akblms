import React from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Clock, MapPin, User, Download, Calendar } from 'lucide-react';

export const SchedulePage: React.FC = () => {
  const days = [
    {
      name: 'Dushanba',
      classes: [
        {
          time: '09:00 - 10:30',
          subject: 'Dasturlash Asoslari (CS-101)',
          room: 'Lab-3',
          teacher: 'Bobur Mirzayev',
        },
        {
          time: '11:00 - 12:30',
          subject: 'Oliy Matematika (MATH-201)',
          room: 'Xona 304',
          teacher: 'Bobur Mirzayev',
        },
      ],
    },
    {
      name: 'Seshanba',
      classes: [
        {
          time: '10:00 - 11:30',
          subject: 'Akademik Ingliz Tili (ENG-301)',
          room: 'Auditoriya 1',
          teacher: 'Malika Raximova',
        },
        {
          time: '13:00 - 14:30',
          subject: 'Fizika Asoslari',
          room: 'Laboratoriya 2',
          teacher: 'Sanjar Karimov',
        },
      ],
    },
    {
      name: 'Chorshanba',
      classes: [
        {
          time: '09:00 - 10:30',
          subject: 'Algoritmlar va Ma’lumotlar Tuzilmasi',
          room: 'Lab-3',
          teacher: 'Bobur Mirzayev',
        },
        {
          time: '11:00 - 12:30',
          subject: 'Oliy Matematika Amaliy Mashg‘ulot',
          room: 'Xona 304',
          teacher: 'Bobur Mirzayev',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Haftalik Dars Jadvali
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            2026 Bahorgi semestr darslari va auditoriyalar taqsimoti
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<Download className="w-4 h-4" />}
          onClick={() => alert('Dars jadvali PDF shaklida yuklab olindi')}
        >
          PDF Yuklab Olish
        </Button>
      </div>

      <div className="space-y-4">
        {days.map((day) => (
          <Card key={day.name}>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">{day.name}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {day.classes.map((cls, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-indigo-200 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 mb-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {cls.time}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5" /> {cls.room}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{cls.subject}</h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" /> {cls.teacher}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
