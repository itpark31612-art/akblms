import React from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { CreditCard, Download, CheckCircle } from 'lucide-react';

export const PaymentsPage: React.FC = () => {
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            O‘quv To‘lovlari & Hisob-kitoblar
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Ta’lim shartnomalari, to‘lovlar tarixi va kvitansiyalar arxivi
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<CreditCard className="w-4 h-4" />}
          onClick={() => alert('Onlayn to‘lov tizimi (Click / Payme) integratsiyasi ochildi')}
        >
          Onlayn To‘lov Qilish
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-4">Kvitansiya ID</th>
                <th className="py-3 px-4">Davr (Oy)</th>
                <th className="py-3 px-4">To‘lov Miqdori</th>
                <th className="py-3 px-4">Sanasi</th>
                <th className="py-3 px-4">To‘lov Usuli</th>
                <th className="py-3 px-4">Holati</th>
                <th className="py-3 px-4 text-right">Kvitansiya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{inv.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{inv.month}</td>
                  <td className="py-3.5 px-4 font-bold text-indigo-600">{inv.amount}</td>
                  <td className="py-3.5 px-4 text-slate-500">{inv.date}</td>
                  <td className="py-3.5 px-4">{inv.method}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Download className="w-3.5 h-3.5" />}
                      onClick={() => alert(`${inv.id} kvitansiyasi PDF yuklab olindi`)}
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
    </div>
  );
};
