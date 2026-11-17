import React, { useState } from 'react';
import { Card } from '../../../design-system/components/Card';
import { Button } from '../../../design-system/components/Button';
import { Modal } from '../../../design-system/components/Modal';
import { Badge } from '../../../design-system/components/Badge';
import { useToast } from '../../../design-system/components/Toast';
import { PageTransition } from '../../../design-system/motion/PageTransition';
import { CounterAnimation } from '../../../design-system/motion/CounterAnimation';
import { StaggerContainer, StaggerItem } from '../../../design-system/motion/StaggerAnimation';
import {
  Users,
  CalendarCheck,
  Award,
  CreditCard,
  MessageSquare,
  CheckCircle,
  PhoneCall,
} from 'lucide-react';

export const ParentDashboardView: React.FC = () => {
  const toast = useToast();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState('Alisher Sobirov');
  const [messageText, setMessageText] = useState('');

  const children = [
    {
      id: '1',
      name: 'Alisher Sobirov',
      grade: '9-A Sinf',
      school: 'Toshkent Xalqaro Akademiyasi',
      gpa: '3.86',
      attendance: '97.2%',
      lastGrade: 'Dasturlash - 98 ball',
    },
    {
      id: '2',
      name: 'Madina Sobirova',
      grade: '7-B Sinf',
      school: 'Toshkent Xalqaro Akademiyasi',
      gpa: '3.70',
      attendance: '96.0%',
      lastGrade: 'Ingliz tili - 92 ball',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    toast.success('Xabar yuborildi', `${selectedChild} ning sinf rahbariga xabaringiz yetkazildi`);
    setMessageText('');
    setIsMessageModalOpen(false);
  };

  return (
    <PageTransition className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Ota-ona Monitoring Xonasi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Farzandlaringiz ta’lim samaradorligi, davomati va to‘lovlar nazorati
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<MessageSquare className="w-4 h-4" />}
            onClick={() => setIsMessageModalOpen(true)}
          >
            O‘qituvchiga Xabar Yozish
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
                  Farzandlarim
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={children.length} suffix=" nafar" />
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              EMS tizimida ro‘yxatda
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card hover accent="emerald" className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Umumiy Davomat
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={96.6} decimals={1} suffix="%" />
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              A’lo darajada
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card hover accent="purple" className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  O‘rtacha GPA
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={3.78} decimals={2} />
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              4.0 maksimal shkala
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card hover accent="indigo" className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Oylik To‘lov
                </p>
                <h3 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1.5">
                  To‘langan
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              Noyabr 2026 uchun
            </div>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* Children Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((c) => (
          <Card key={c.id} className="relative overflow-hidden text-left">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{c.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {c.grade} • {c.school}
                </p>
              </div>
              <Badge variant="purple">GPA: {c.gpa}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Davomat:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {c.attendance}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">So‘nggi Baho:</span>
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                  {c.lastGrade}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Darslarda to‘liq ishtirok etmoqda
              </span>
              <Button
                variant="ghost"
                size="sm"
                icon={<PhoneCall className="w-3.5 h-3.5" />}
                onClick={() => toast.info('Sinf Rahbari', `Aloqa: +998 71 200 11 22 (${c.name})`)}
              >
                Sinf Rahbari
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Send Message Modal */}
      <Modal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        title="O‘qituvchiga Xabar Yuborish"
        description="Farzandingiz dars jarayoni yuzasidan o‘qituvchiga to‘g‘ridan-to‘g‘ri murojaat"
      >
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Farzandni Tanlang
            </label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 focus:border-indigo-500"
            >
              {children.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.grade})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Xabar Matni
            </label>
            <textarea
              rows={4}
              placeholder="Assalomu alaykum, farzandimning dars jarayonlari haqida..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 focus:border-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsMessageModalOpen(false)}
            >
              Bekor qilish
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Xabarni Yuborish
            </Button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
};
