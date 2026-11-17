import React from 'react';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import { useToast } from '../../design-system/components/Toast';
import { PageTransition } from '../../design-system/motion/PageTransition';
import { StaggerContainer, StaggerItem } from '../../design-system/motion/StaggerAnimation';
import { Clock, MapPin, User, Download, Calendar } from 'lucide-react';

export const SchedulePage: React.FC = () => {
  const toast = useToast();

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
    <PageTransition className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Haftalik Dars Jadvali
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            2026 Bahorgi semestr darslari va auditoriyalar taqsimoti
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<Download className="w-4 h-4" />}
          onClick={() => toast.success('Yuklab olindi', 'Dars jadvali PDF formatida saqlandi')}
        >
          PDF Yuklab Olish
        </Button>
      </div>

      <StaggerContainer className="space-y-4">
        {days.map((day) => (
          <StaggerItem key={day.name}>
            <Card>
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {day.name}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {day.classes.map((cls, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {cls.time}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                        <MapPin className="w-3.5 h-3.5" /> {cls.room}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">
                      {cls.subject}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                      <User className="w-3 h-3 text-slate-400" /> {cls.teacher}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </PageTransition>
  );
};
