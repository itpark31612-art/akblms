import React, { useState } from 'react';
import { StatsCard } from '../../../components/common/StatsCard';
import { Card } from '../../../components/common/Card';
import { Button } from '../../../components/common/Button';
import { Modal } from '../../../components/common/Modal';
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
    alert(`Xabar o‘qituvchiga muvaffaqiyatli yuborildi: "${messageText}"`);
    setMessageText('');
    setIsMessageModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Ota-ona Monitoring Xonasi
          </h2>
          <p className="text-sm text-slate-500 mt-1">
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Farzandlar Soni"
          value={children.length}
          icon={<Users className="w-5 h-5" />}
          subtitle="EMS tizimida ro‘yxatda"
          color="indigo"
        />
        <StatsCard
          title="Umumiy Davomat"
          value="96.6%"
          icon={<CalendarCheck className="w-5 h-5" />}
          trend={{ value: 'A’lo darajada', isPositive: true }}
          color="emerald"
        />
        <StatsCard
          title="O‘rtacha Akademik GPA"
          value="3.78"
          icon={<Award className="w-5 h-5" />}
          subtitle="4.0 maksimal shkala"
          color="purple"
        />
        <StatsCard
          title="Oylik To‘lov Holati"
          value="To‘langan"
          icon={<CreditCard className="w-5 h-5" />}
          subtitle="Noyabr 2026 uchun to‘liq"
          color="blue"
        />
      </div>

      {/* Children Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((c) => (
          <Card key={c.id} className="relative overflow-hidden">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{c.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {c.grade} • {c.school}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                GPA: {c.gpa}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Davomat:</span>
                <span className="font-bold text-emerald-600 mt-0.5 block">{c.attendance}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">So‘nggi Baho:</span>
                <span className="font-bold text-indigo-600 mt-0.5 block">{c.lastGrade}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Darslarda qatnashmoqda
              </span>
              <Button
                variant="ghost"
                size="sm"
                icon={<PhoneCall className="w-3.5 h-3.5" />}
                onClick={() => alert(`Sinf rahbari telefoni: +998 71 200 11 22 (${c.name})`)}
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Farzandni Tanlang
            </label>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            >
              {children.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.grade})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Xabar Matni</label>
            <textarea
              rows={4}
              placeholder="Assalomu alaykum, farzandimning dars jarayonlari haqida..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
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
    </div>
  );
};
