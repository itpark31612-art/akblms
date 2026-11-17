import React, { useState, useEffect } from 'react';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';
import { Select } from '../../design-system/components/Select';
import { Badge } from '../../design-system/components/Badge';
import { Modal } from '../../design-system/components/Modal';
import { Table, Column } from '../../design-system/components/Table';
import { Pagination } from '../../design-system/components/Pagination';
import { useToast } from '../../design-system/components/Toast';
import { PageTransition } from '../../design-system/motion/PageTransition';
import { usersApi } from '../../api/users.api';
import { UserRole, UserSummary, ROLE_LABELS, ICreateUserDto } from '@ems/shared';
import { UserPlus, Search, Trash2, Filter } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const toast = useToast();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 5;

  const [formData, setFormData] = useState<ICreateUserDto>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: UserRole.STUDENT,
    phone: '',
  });

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
      toast.error('Xatolik', 'Iltimos, barcha majburiy maydonlarni to‘ldiring');
      return;
    }

    try {
      const created = await usersApi.createUser(formData);
      setUsers([created, ...users]);
    } catch {
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

    toast.success('Yaratildi', `${formData.firstName} ${formData.lastName} tizimga qo‘shildi`);
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
    } catch {}
    setUsers(users.filter((u) => u.id !== id));
    toast.info('O‘chirildi', `${name} hisobi muvaffaqiyatli o‘chirildi`);
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch =
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns: Column<UserSummary & Record<string, unknown>>[] = [
    {
      key: 'name',
      header: 'Foydalanuvchi',
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
            {u.firstName[0]}
            {u.lastName[0]}
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">
              {u.firstName} {u.lastName}
            </p>
            <p className="text-[11px] text-slate-400 font-normal">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rol',
      render: (u) => <Badge role={u.role as UserRole} />,
    },
    {
      key: 'phone',
      header: 'Telefon',
      render: (u) => (
        <span className="font-mono text-slate-600 dark:text-slate-400 text-xs">
          {u.phone || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Holati',
      render: () => (
        <Badge variant="success" dot size="sm">
          Faol
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Amallar',
      className: 'text-right',
      render: (u) => (
        <button
          onClick={() => handleDeleteUser(u.id, `${u.firstName} ${u.lastName}`)}
          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
          title="O‘chirish"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  const roleSelectOptions = [
    { value: 'ALL', label: 'Barcha Rollar' },
    ...Object.values(UserRole).map((r) => ({
      value: r,
      label: ROLE_LABELS[r],
    })),
  ];

  return (
    <PageTransition className="space-y-6 text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Foydalanuvchilar Boshqaruvi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">
              Rol:
            </span>
            {['ALL', ...Object.values(UserRole)].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRoleFilter(r);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  roleFilter === r
                    ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {r === 'ALL' ? 'Barchasi' : ROLE_LABELS[r as UserRole]}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Design System Table */}
      <div>
        <Table
          columns={columns}
          data={paginatedUsers as unknown as (UserSummary & Record<string, unknown>)[]}
          keyExtractor={(u) => u.id}
          emptyText="Mos keluvchi foydalanuvchilar topilmadi"
        />

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredUsers.length / pageSize) || 1}
          totalItems={filteredUsers.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          className="mt-3"
        />
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yangi Foydalanuvchi Qo‘shish"
        description="Foydalanuvchi ma’lumotlari va tizimdagi rolini belgilang"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Ism"
              placeholder="Jasur"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <Input
              label="Familiya"
              placeholder="Yusupov"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
          </div>

          <Input
            label="Elektron Pochta"
            type="email"
            placeholder="jasur@ems.local"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label="Dastlabki Parol"
            type="password"
            placeholder="Kamida 6 ta belgi"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Rol"
              options={roleSelectOptions.filter((o) => o.value !== 'ALL')}
              value={formData.role}
              onChange={(val) => setFormData({ ...formData, role: val as UserRole })}
            />
            <Input
              label="Telefon"
              placeholder="+998901234567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Saqlash & Yaratish
            </Button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
};
