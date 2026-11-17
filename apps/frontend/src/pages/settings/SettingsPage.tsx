import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { Shield, Bell, Lock, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || 'Sanjar');
  const [lastName, setLastName] = useState(user?.lastName || 'Karimov');
  const [phone, setPhone] = useState(user?.phone || '+998901234567');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Sozlamalar muvaffaqiyatli saqlandi!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Tizim & Profil Sozlamalari
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Shaxsiy hisob ma’lumotlari, xavfsizlik va bildirishnoma parametrlari
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            Shaxsiy Ma’lumotlar
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Ism"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Familiya"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <Input
              label="Elektron pochta"
              value={user?.email || 'user@ems.local'}
              disabled
              helperText="Elektron pochtani o‘zgartirish uchun ma’muriyatga murojaat qiling"
            />
            <Input
              label="Telefon raqami"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </Card>

        {/* Security & Notifications */}
        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            Xavfsizlik & Bildirishnomalar
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-xs font-semibold text-slate-900">Email Bildirishnomalari</p>
                  <p className="text-[11px] text-slate-500">
                    Yangi baholar va dars o‘zgarishlari haqida xabar
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    Ikki Bosqichli Himoya (2FA)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Kirishda SMS yoki Authenticator kodi bilan tasdiqlash
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md" icon={<Save className="w-4 h-4" />}>
            O‘zgarishlarni Saqlash
          </Button>
        </div>
      </form>
    </div>
  );
};
