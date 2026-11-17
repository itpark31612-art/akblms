import React from 'react';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import { Badge } from '../../design-system/components/Badge';
import { useToast } from '../../design-system/components/Toast';
import { PageTransition } from '../../design-system/motion/PageTransition';
import { CreditCard, Download } from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const toast = useToast();

  const invoices = [
    {
      id: 'INV-2026-001',
      month: 'Noyabr 2026',
      amount: '1,200,000 UZS',
      status: 'To‘langan',
      date: '05.11.2026',
      method: 'Payme / Uzum',
    },
    {
      id: 'INV-2026-002',
      month: 'Oktyabr 2026',
      amount: '1,200,000 UZS',
      status: 'To‘langan',
      date: '04.10.2026',
      method: 'Bank O‘tkazmasi',
    },
    {
      id: 'INV-2026-003',
      month: 'Sentabr 2026',
      amount: '1,200,000 UZS',
      status: 'To‘langan',
      date: '02.09.2026',
      method: 'Click',
    },
  ];

  return (
    <PageTransition className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            O‘quv To‘lovlari & Hisob-kitoblar
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ta’lim shartnomalari, to‘lovlar tarixi va kvitansiyalar arxivi
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<CreditCard className="w-4 h-4" />}
          onClick={() => toast.info('To‘lov Tizimi', 'Click / Payme to‘lov shlyuzi ochildi')}
        >
          Onlayn To‘lov Qilish
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-4">Kvitansiya ID</th>
                <th className="py-3 px-4">Davr (Oy)</th>
                <th className="py-3 px-4">To‘lov Miqdori</th>
                <th className="py-3 px-4">Sanasi</th>
                <th className="py-3 px-4">To‘lov Usuli</th>
                <th className="py-3 px-4">Holati</th>
                <th className="py-3 px-4 text-right">Kvitansiya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {inv.id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {inv.month}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-indigo-600 dark:text-indigo-400">
                    {inv.amount}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{inv.date}</td>
                  <td className="py-3.5 px-4">{inv.method}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success" dot size="sm">
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Download className="w-3.5 h-3.5" />}
                      onClick={() =>
                        toast.success('Yuklab olindi', `${inv.id} kvitansiyasi PDF saqlandi`)
                      }
                    >
                      Yuklab olish
                    </Button>
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
