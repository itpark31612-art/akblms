import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">403 — Ruxsat Cheklangan</h1>
      <p className="text-sm text-slate-500 max-w-md mt-2 mb-6">
        Sizning hisobingiz ushbu sahifa yoki modulga kirish vakolatiga ega emas. Agar bu xatolik deb
        o‘ylasangiz, administratorga murojaat qiling.
      </p>
      <Button
        variant="primary"
        size="md"
        icon={<ArrowLeft className="w-4 h-4" />}
        onClick={() => navigate('/dashboard')}
      >
        Boshqaruv Paneliga Qaytish
      </Button>
    </div>
  );
};
