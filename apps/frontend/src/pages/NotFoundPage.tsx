import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { FileQuestion, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
        404 — Sahifa Topilmadi
      </h1>
      <p className="text-sm text-slate-500 max-w-md mt-2 mb-6">
        Siz qidirayotgan sahifa mavjud emas, ko‘chirilgan yoki manzili noto‘g‘ri kiritilgan.
      </p>
      <Button
        variant="primary"
        size="md"
        icon={<Home className="w-4 h-4" />}
        onClick={() => navigate('/dashboard')}
      >
        Bosh Sahifaga Qaytish
      </Button>
    </div>
  );
};
