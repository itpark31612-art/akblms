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
import { useAuth } from '../../context/AuthContext';
import { usersApi } from '../../api/users.api';
import {
  UserRole,
  UserStatus,
  UserSummary,
  ROLE_LABELS,
  ICreateUserDto,
  AppPermission,
} from '@ems/shared';
import { UserPlus, Search, Trash2, Filter, ShieldAlert, ShieldCheck } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { hasPermission, role } = useAuth();
  const toast = useToast();

  const [users, setUsers] = useState<UserSummary[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 8;

  const [formData, setFormData] = useState<ICreateUserDto>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: UserRole.STUDENT,
    phone: '',
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await usersApi.getUsers();
      if (res.items) {
        setUsers(res.items);
      }
    } catch (err: unknown) {
      console.warn('Foydalanuvchilarni yuklashda xatolik:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Foydalanuvchi yaratilmadi';
      toast.error('Xatolik', msg);
    }
  };

  const handleToggleStatus = async (user: UserSummary) => {
    const isCurrentlyActive =
      user.status === 'ACTIVE' || (user.isActive && user.status !== 'BLOCKED');
    const newStatus = isCurrentlyActive ? UserStatus.BLOCKED : UserStatus.ACTIVE;
    const actionLabel = isCurrentlyActive ? 'bloklash' : 'faollashtirish';

    if (!confirm(`${user.firstName} ${user.lastName} hisobini ${actionLabel}ni tasdiqlaysizmi?`)) {
      return;
    }

    try {
      const updated = await usersApi.updateStatus(user.id, {
        status: newStatus,
        reason: isCurrentlyActive ? 'Administrator tomonidan bloklandi' : 'Qayta faollashtirildi',
      });

      setUsers(users.map((u) => (u.id === user.id ? updated : u)));
      toast.success(
        'Holat yangilandi',
        `${user.firstName} ${user.lastName} hisobi muvaffaqiyatli [${newStatus}] qilindi`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Holatni o‘zgartirib bo‘lmadi';
      toast.error('Xatolik', msg);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`${name} nomli foydalanuvchini tizimdan o‘chirishni tasdiqlaysizmi?`)) {
      return;
    }

    try {
      await usersApi.deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
      toast.info('O‘chirildi', `${name} hisobi muvaffaqiyatli o‘chirildi`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'O‘chirishda xatolik';
      toast.error('Xatolik', msg);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const isUserActive = u.status === 'ACTIVE' || (u.isActive && u.status !== 'BLOCKED');
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && isUserActive) ||
      (statusFilter === 'BLOCKED' && !isUserActive);

    const matchesSearch =
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    return matchesRole && matchesStatus && matchesSearch;
  });

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const canCreate =
    hasPermission(AppPermission.USERS_CREATE) ||
    role === UserRole.SUPER_ADMIN ||
    role === UserRole.ADMIN;
  const canChangeStatus =
    hasPermission(AppPermission.USERS_STATUS) ||
    role === UserRole.SUPER_ADMIN ||
    role === UserRole.ADMIN;
  const canDelete =
    hasPermission(AppPermission.USERS_DELETE) ||
    role === UserRole.SUPER_ADMIN ||
    role === UserRole.ADMIN;

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
      render: (u) => {
        const isBlocked = u.status === 'BLOCKED' || !u.isActive;
        if (isBlocked) {
          return (
            <Badge variant="danger" dot size="sm">
              Bloklangan
            </Badge>
          );
        }
        if (u.status === 'SUSPENDED') {
          return (
            <Badge variant="warning" dot size="sm">
              To‘xtatilgan
            </Badge>
          );
        }
        return (
          <Badge variant="success" dot size="sm">
            Faol
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Amallar & Nazorat',
      className: 'text-right',
      render: (u) => {
        const isBlocked = u.status === 'BLOCKED' || !u.isActive;
        return (
          <div className="flex items-center justify-end gap-1.5">
            {canChangeStatus && (
              <button
                onClick={() => handleToggleStatus(u as UserSummary)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1 ${
                  isBlocked
                    ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                    : 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                }`}
                title={isBlocked ? 'Hisobni faollashtirish' : 'Hisobni bloklash'}
              >
                {isBlocked ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
              </button>
            )}

            {canDelete && (
              <button
                onClick={() => handleDeleteUser(u.id, `${u.firstName} ${u.lastName}`)}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                title="O‘chirish"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      },
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
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Foydalanuvchilar Boshqaruvi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Platformadagi barcha 5 ta roldagi foydalanuvchilar hisoblari, RBAC va bloklash nazorati
          </p>
        </div>
        {canCreate && (
          <Button
            variant="primary"
            size="sm"
            icon={<UserPlus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Yangi Foydalanuvchi Qo‘shish
          </Button>
        )}
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

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">
                Holat:
              </span>
              {[
                { id: 'ALL', label: 'Barchasi' },
                { id: 'ACTIVE', label: 'Faol' },
                { id: 'BLOCKED', label: 'Bloklangan' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setStatusFilter(s.id);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    statusFilter === s.id
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
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
        </div>
      </Card>

      {/* Table */}
      <div>
        <Table
          columns={columns}
          data={paginatedUsers as unknown as (UserSummary & Record<string, unknown>)[]}
          keyExtractor={(u) => u.id}
          emptyText={
            isLoading
              ? 'Foydalanuvchilar yuklanmoqda...'
              : 'Mos keluvchi foydalanuvchilar topilmadi'
          }
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
        description="Foydalanuvchi ma’lumotlari, xavfsiz paroli va tizimdagi rolini belgilang"
      >
        <form onSubmit={handleCreateUser} className="space-y-4 text-left">
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
