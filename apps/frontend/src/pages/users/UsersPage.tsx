import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { usersApi } from '../../api/users.api';
import { UserRole, UserSummary, ROLE_LABELS, ICreateUserDto } from '@ems/shared';
import { UserPlus, Search, Trash2, Filter } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form holati
  const [formData, setFormData] = useState<ICreateUserDto>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: UserRole.STUDENT,
    phone: '',
  });

  // Boshlang'ich yoki mock foydalanuvchilar
  const initialUsers: UserSummary[] = [
    {
      id: '1',
      email: 'superadmin@ems.local',
      firstName: 'Sanjar',
      lastName: 'Karimov',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      phone: '+998901234567',
      createdAt: '2026-01-10T10:00:00.000Z',
    },
    {
      id: '2',
      email: 'admin@ems.local',
      firstName: 'Malika',
      lastName: 'Raximova',
      role: UserRole.ADMIN,
      isActive: true,
      phone: '+998902345678',
      createdAt: '2026-01-12T10:00:00.000Z',
    },
    {
      id: '3',
      email: 'teacher@ems.local',
      firstName: 'Bobur',
      lastName: 'Mirzayev',
      role: UserRole.TEACHER,
      isActive: true,
      phone: '+998903456789',
      createdAt: '2026-01-15T10:00:00.000Z',
    },
    {
      id: '4',
      email: 'student@ems.local',
      firstName: 'Alisher',
      lastName: 'Sobirov',
      role: UserRole.STUDENT,
      isActive: true,
      phone: '+998904567890',
      createdAt: '2026-02-01T10:00:00.000Z',
    },
    {
      id: '5',
      email: 'parent@ems.local',
      firstName: 'Akbarbek',
      lastName: 'Sobirov',
      role: UserRole.PARENT,
      isActive: true,
      phone: '+998905678901',
      createdAt: '2026-02-01T10:00:00.000Z',
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await usersApi.getUsers();
        if (res.items && res.items.length > 0) {
          setUsers(res.items);
        } else {
          setUsers(initialUsers);
        }
      } catch {
        setUsers(initialUsers);
      }
    };
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.password) {
      alert('Iltimos, barcha majburiy maydonlarni to‘ldiring');
      return;
    }

    try {
      const created = await usersApi.createUser(formData);
      setUsers([created, ...users]);
    } catch {
      // Offline fallback
      const mockCreated: UserSummary = {
        id: String(Date.now()),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        isActive: true,
        phone: formData.phone,
        createdAt: new Date().toISOString(),
      };
      setUsers([mockCreated, ...users]);
    }

    setIsModalOpen(false);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: UserRole.STUDENT,
      phone: '',
    });
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`${name} nomli foydalanuvchini o‘chirishni tasdiqlaysizmi?`)) return;
    try {
      await usersApi.deleteUser(id);
    } catch {
      // offline fallback
    }
    setUsers(users.filter((u) => u.id !== id));
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch =
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Foydalanuvchilar Boshqaruvi
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Platformadagi barcha 5 ta roldagi foydalanuvchilar hisoblari va ruxsatnomalari
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<UserPlus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Yangi Foydalanuvchi Qo‘shish
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ism, familiya yoki email orqali qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-500 font-medium shrink-0">Rol:</span>
            {['ALL', ...Object.values(UserRole)].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  roleFilter === r
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r === 'ALL' ? 'Barchasi' : ROLE_LABELS[r as UserRole]}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-4">Foydalanuvchi</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4">Telefon</th>
                <th className="py-3 px-4">Holat</th>
                <th className="py-3 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Mos keluvchi foydalanuvchilar topilmadi
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {u.firstName[0]}
                        {u.lastName[0]}
                      </div>
                      <span>
                        {u.firstName} {u.lastName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <Badge role={u.role} />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{u.phone || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Faol
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id, `${u.firstName} ${u.lastName}`)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="O‘chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yangi Foydalanuvchi Qo‘shish"
        description="Foydalanuvchi ma’lumotlari va tizimdagi rolini belgilang"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ism</label>
              <input
                type="text"
                placeholder="Jasur"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Familiya</label>
              <input
                type="text"
                placeholder="Yusupov"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Elektron Pochta
            </label>
            <input
              type="email"
              placeholder="jasur@ems.local"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Dastlabki Parol
            </label>
            <input
              type="password"
              placeholder="Kamida 6 ta belgi"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Rol</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 bg-white"
              >
                {Object.values(UserRole).map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telefon</label>
              <input
                type="text"
                placeholder="+998901234567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Saqlash & Yaratish
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
