import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import { Badge } from '../../design-system/components/Badge';
import { useToast } from '../../design-system/components/Toast';
import { PageTransition } from '../../design-system/motion/PageTransition';
import { StaggerContainer, StaggerItem } from '../../design-system/motion/StaggerAnimation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Search,
  UserPlus,
  Phone,
  Mail,
  Archive,
  RotateCcw,
  Edit2,
  Trash2,
  ExternalLink,
  Award,
  CalendarCheck,
  LayoutGrid,
  List,
  RefreshCw,
  X,
} from 'lucide-react';
import {
  studentsApi,
  StudentFilterParams,
  ClassRoomItem,
} from '../../api/students.api';
import {
  IStudentSummary,
  ICreateStudentInput,
  IUpdateStudentInput,
} from '@ems/shared';

export const StudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Holatlar
  const [students, setStudents] = useState<IStudentSummary[]>([]);
  const [classrooms, setClassrooms] = useState<ClassRoomItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filtr parametrlari
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [classRoomFilter, setClassRoomFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modallar
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<IStudentSummary | null>(null);

  // Yangi o'quvchi formasi
  const [createForm, setCreateForm] = useState<ICreateStudentInput>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    classRoomId: '',
    birthDate: '',
    address: '',
    avatarUrl: '',
    password: '',
  });

  // Tahrirlash formasi
  const [editForm, setEditForm] = useState<IUpdateStudentInput>({
    firstName: '',
    lastName: '',
    phone: '',
    classRoomId: '',
    birthDate: '',
    address: '',
    avatarUrl: '',
    status: 'ACTIVE',
  });

  // O'quvchilarni yuklash
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params: StudentFilterParams = {
        search: search.trim() || undefined,
        status: statusFilter,
        classRoomId: classRoomFilter,
        page,
        pageSize: 12,
      };

      const res = await studentsApi.getStudents(params);
      setStudents(res.items);
      setTotalPages(res.totalPages);
      setTotalCount(res.total);
    } catch (err: any) {
      console.error('O‘quvchilarni yuklashda xatolik:', err);
      toast.error('Xatolik', err.message || 'O‘quvchilar ro‘yxatini yuklab bo‘lmadi');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, classRoomFilter, page, toast]);

  // Guruhlarni yuklash
  const fetchClassRooms = async () => {
    try {
      const list = await studentsApi.getClassRooms();
      setClassrooms(list);
    } catch (err) {
      console.error('Guruhlarni yuklashda xato:', err);
    }
  };

  useEffect(() => {
    fetchClassRooms();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Yangi o'quvchi qo'shish
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.firstName || !createForm.lastName || !createForm.email) {
      toast.warning('Maydonlar to‘liq emas', 'Ism, familiya va email kiritilishi shart');
      return;
    }

    try {
      const res = await studentsApi.createStudent(createForm);
      toast.success(
        'Qo‘shildi',
        `${createForm.firstName} ${createForm.lastName} (${res.studentCode}) muvaffaqiyatli saqlandi`
      );
      setIsCreateModalOpen(false);
      setCreateForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        classRoomId: '',
        birthDate: '',
        address: '',
        avatarUrl: '',
        password: '',
      });
      fetchStudents();
    } catch (err: any) {
      toast.error('Xatolik', err.message || 'O‘quvchini qo‘shishda xatolik yuz berdi');
    }
  };

  // Tahrirlashni boshlash
  const handleOpenEdit = (student: IStudentSummary) => {
    setSelectedStudent(student);
    setEditForm({
      firstName: student.firstName,
      lastName: student.lastName,
      phone: student.phone || '',
      classRoomId: student.classRoomId || '',
      birthDate: student.birthDate ? student.birthDate.split('T')[0] : '',
      address: student.address || '',
      avatarUrl: student.avatarUrl || '',
      status: student.status,
    });
    setIsEditModalOpen(true);
  };

  // Tahrirlashni saqlash
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    try {
      await studentsApi.updateStudent(selectedStudent.id, editForm);
      toast.success('Yangilandi', 'O‘quvchi ma’lumotlari muvaffaqiyatli saqlandi');
      setIsEditModalOpen(false);
      fetchStudents();
    } catch (err: any) {
      toast.error('Xatolik', err.message || 'O‘quvchini tahrirlashda xatolik');
    }
  };

  // Arxivlash yoki arxivdan chiqarish
  const handleToggleArchive = async (student: IStudentSummary) => {
    const isArchived = student.status === 'ARCHIVED';
    const actionText = isArchived ? 'arxivdan chiqarish' : 'arxivlash';

    if (!confirm(`${student.firstName} ${student.lastName} hisobini ${actionText}ni tasdiqlaysizmi?`)) {
      return;
    }

    try {
      await studentsApi.archiveStudent(student.id, !isArchived);
      toast.success(
        isArchived ? 'Arxivdan chiqarildi' : 'Arxivlandi',
        `${student.firstName} ${student.lastName} holati o‘zgartirildi`
      );
      fetchStudents();
    } catch (err: any) {
      toast.error('Xatolik', err.message || 'Holatni o‘zgartirib bo‘lmadi');
    }
  };

  // O'quvchini o'chirish
  const handleDeleteStudent = async (student: IStudentSummary) => {
    if (
      !confirm(
        `DIQQAT: ${student.firstName} ${student.lastName} hisobi va barcha bog‘liq ma’lumotlari butunlay o‘chiriladi. Tasdiqlaysizmi?`
      )
    ) {
      return;
    }

    try {
      await studentsApi.deleteStudent(student.id);
      toast.success('O‘chirildi', 'O‘quvchi tizimdan muvaffaqiyatli o‘chirildi');
      fetchStudents();
    } catch (err: any) {
      toast.error('Xatolik', err.message || 'O‘quvchini o‘chirishda xatolik');
    }
  };

  // Bosh harflar (Initials)
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <PageTransition className="space-y-6">
      {/* 1. YUQORI SARLAVHA VA ASOSIY TUGMALAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              O‘quvchilar Boshqaruvi
            </h2>
            <Badge variant="purple" size="sm">
              {totalCount} ta o‘quvchi
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Akademik tarkib, shaxsiy profillar, guruhlar, davomat va to‘lovlar monitoringi
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            onClick={() => fetchStudents()}
            title="Yangilash"
          >
            Yangilash
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<UserPlus className="w-4 h-4" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Yangi O‘quvchi Qo‘shish
          </Button>
        </div>
      </div>

      {/* 2. FILTRLAR VA QIDIRUV PANELI */}
      <Card className="p-4 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/70 dark:border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-center">
          {/* Qidiruv (Ism, telefon, ID) */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Ism, familiya, telefon yoki STU-2026 ID bo‘yicha qidiruv..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Guruh bo'yicha filter */}
          <div className="lg:col-span-3">
            <select
              value={classRoomFilter}
              onChange={(e) => {
                setClassRoomFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="ALL">Barcha guruhlar & sinflar</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c._count?.students || 0} o‘quvchi)
                </option>
              ))}
            </select>
          </div>

          {/* Status bo'yicha filter */}
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="ALL">Barcha holatlar</option>
              <option value="ACTIVE">Faol (Active)</option>
              <option value="ARCHIVED">Arxivlangan (Archived)</option>
              <option value="BLOCKED">Bloklangan (Blocked)</option>
              <option value="SUSPENDED">To‘xtatilgan (Suspended)</option>
            </select>
          </div>

          {/* Ko'rinish rejimi (Grid vs Table) */}
          <div className="lg:col-span-2 flex items-center justify-end gap-1.5">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Kartochkalar ko‘rinishi"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Jadval ko‘rinishi"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* 3. ASOSIY RO‘YXAT: KARTOCHKALAR (GRID) YOKI JADVAL (TABLE) */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          ))}
        </div>
      ) : students.length === 0 ? (
        <Card className="p-12 text-center">
          <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Hech qanday o‘quvchi topilmadi
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            Qidiruv so‘rovi yoki filtrlarni o‘zgartirib qayta urinib ko‘ring.
          </p>
          <Button variant="outline" size="sm" onClick={() => { setSearch(''); setStatusFilter('ALL'); setClassRoomFilter('ALL'); }}>
            Filtrlarni tozalash
          </Button>
        </Card>
      ) : viewMode === 'grid' ? (
        /* KARTOCHKALAR KO‘RINISHI (HOVER EFFEKTLAR BILAN) */
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {students.map((student) => (
            <StaggerItem key={student.id}>
              <motion.div
                whileHover={{
                  y: -4,
                  transition: { duration: 0.2 },
                }}
                className="h-full"
              >
                <Card
                  hover
                  className={`h-full flex flex-col justify-between p-5 border transition-all duration-300 relative group ${
                    student.status === 'ARCHIVED'
                      ? 'border-amber-200 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/80 hover:shadow-xl hover:shadow-indigo-500/5'
                  }`}
                >
                  <div>
                    {/* Yuqori qism: Avatar, ID va Status */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="relative">
                        {student.avatarUrl ? (
                          <img
                            src={student.avatarUrl}
                            alt={`${student.firstName} ${student.lastName}`}
                            className="w-13 h-13 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-sm"
                          />
                        ) : (
                          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-extrabold text-sm flex items-center justify-center shadow-sm">
                            {getInitials(student.firstName, student.lastName)}
                          </div>
                        )}
                        <span
                          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                            student.status === 'ACTIVE'
                              ? 'bg-emerald-500'
                              : student.status === 'ARCHIVED'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700">
                          {student.studentCode}
                        </span>
                        <div className="mt-1">
                          <Badge
                            variant={
                              student.status === 'ACTIVE'
                                ? 'success'
                                : student.status === 'ARCHIVED'
                                ? 'warning'
                                : 'danger'
                            }
                            size="sm"
                          >
                            {student.status === 'ACTIVE'
                              ? 'Faol'
                              : student.status === 'ARCHIVED'
                              ? 'Arxivda'
                              : 'Bloklangan'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Ism va Guruh */}
                    <h3
                      onClick={() => navigate(`/students/${student.id}`)}
                      className="text-base font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors line-clamp-1"
                    >
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      {student.classRoomName || 'Guruh belgilanmagan'}
                    </p>

                    {/* Aloqa ma'lumotlari */}
                    <div className="mt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                      {student.phone && (
                        <p className="flex items-center gap-2 truncate">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{student.phone}</span>
                        </p>
                      )}
                      <p className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{student.email}</span>
                      </p>
                    </div>

                    {/* O‘qish va Davomat ko'rsatkichlari */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-center">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
                          <Award className="w-3 h-3 text-amber-500" /> GPA
                        </span>
                        <p className="text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5">
                          {student.gpa.toFixed(2)}
                        </p>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
                          <CalendarCheck className="w-3 h-3 text-emerald-500" /> Davomat
                        </span>
                        <p className="text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5">
                          {student.attendanceRate}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pastki Harakatlar Paneli */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1 text-xs"
                      icon={<ExternalLink className="w-3.5 h-3.5" />}
                      onClick={() => navigate(`/students/${student.id}`)}
                    >
                      Profil
                    </Button>

                    <button
                      onClick={() => handleOpenEdit(student)}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      title="Tahrirlash"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleToggleArchive(student)}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-amber-600 transition-colors"
                      title={student.status === 'ARCHIVED' ? 'Arxivdan chiqarish' : 'Arxivlash'}
                    >
                      {student.status === 'ARCHIVED' ? (
                        <RotateCcw className="w-4 h-4" />
                      ) : (
                        <Archive className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteStudent(student)}
                      className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 transition-colors"
                      title="O‘chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        /* JADVAL KO‘RINISHI (TABLE) */
        <Card className="overflow-hidden p-0 border border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">O‘quvchi</th>
                  <th className="py-3.5 px-4">Student ID</th>
                  <th className="py-3.5 px-4">Guruh</th>
                  <th className="py-3.5 px-4">Telefon</th>
                  <th className="py-3.5 px-4 text-center">GPA</th>
                  <th className="py-3.5 px-4 text-center">Davomat</th>
                  <th className="py-3.5 px-4">Holat</th>
                  <th className="py-3.5 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {student.avatarUrl ? (
                          <img
                            src={student.avatarUrl}
                            alt=""
                            className="w-9 h-9 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs">
                            {getInitials(student.firstName, student.lastName)}
                          </div>
                        )}
                        <div>
                          <p
                            onClick={() => navigate(`/students/${student.id}`)}
                            className="font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 cursor-pointer"
                          >
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-[11px] text-slate-400">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {student.studentCode}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {student.classRoomName || '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {student.phone || '—'}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800 dark:text-slate-200">
                      {student.gpa.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      {student.attendanceRate}%
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          student.status === 'ACTIVE'
                            ? 'success'
                            : student.status === 'ARCHIVED'
                            ? 'warning'
                            : 'danger'
                        }
                        size="sm"
                      >
                        {student.status === 'ACTIVE'
                          ? 'Faol'
                          : student.status === 'ARCHIVED'
                          ? 'Arxiv'
                          : 'Blok'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/students/${student.id}`)}
                        >
                          Profil
                        </Button>
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleArchive(student)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-500"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 4. PAGINATSIYA */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 text-xs text-slate-500">
          <p>
            Jami <span className="font-bold text-slate-900 dark:text-slate-100">{totalCount}</span> ta o‘quvchidan{' '}
            <span className="font-bold">{students.length}</span> tasi ko‘rsatilmoqda
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Oldingi
            </Button>
            <span className="px-3 py-1 font-bold text-slate-800 dark:text-slate-200">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Keyingi
            </Button>
          </div>
        </div>
      )}

      {/* 5. YANGI O‘QUVCHI QO‘SHISH MODALI (SCALE-UP ANIMATSIYASI BILAN) */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 10 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                transition: { type: 'spring', damping: 25, stiffness: 300 },
              }}
              exit={{ scale: 0.85, opacity: 0, transition: { duration: 0.15 } }}
              className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              {/* Modal Sarlavhasi */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      Yangi O‘quvchi Qo‘shish
                    </h3>
                    <p className="text-xs text-slate-400">
                      ID raqami (STU-2026-XXXX) avtomatik tarzda yaratiladi
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Formasi */}
              <form onSubmit={handleCreateStudent} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Ismi *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masalan: Jasur"
                      value={createForm.firstName}
                      onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Familiyasi *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masalan: Bekmurodov"
                      value={createForm.lastName}
                      onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Elektron Pochta *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="jasur.b@ems.local"
                      value={createForm.email}
                      onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Telefon Raqami
                    </label>
                    <input
                      type="tel"
                      placeholder="+998 90 123 45 67"
                      value={createForm.phone}
                      onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Biriktirilgan Guruh / Sinf
                    </label>
                    <select
                      value={createForm.classRoomId}
                      onChange={(e) => setCreateForm({ ...createForm, classRoomId: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="">Guruh tanlanmagan</option>
                      {classrooms.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tug‘ilgan Sanasi
                    </label>
                    <input
                      type="date"
                      value={createForm.birthDate}
                      onChange={(e) => setCreateForm({ ...createForm, birthDate: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Yashash Manzili
                  </label>
                  <input
                    type="text"
                    placeholder="Toshkent sh., Yunusobod tumani..."
                    value={createForm.address}
                    onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Profil Rasmi (Avatar URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={createForm.avatarUrl}
                    onChange={(e) => setCreateForm({ ...createForm, avatarUrl: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                {/* Tugmalar */}
                <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Bekor qilish
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    icon={<UserPlus className="w-4 h-4" />}
                  >
                    O‘quvchini Saqlash
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. TAHRIRLASH MODALI */}
      <AnimatePresence>
        {isEditModalOpen && selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    <Edit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      O‘quvchi Ma’lumotlarini Tahrirlash
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {selectedStudent.studentCode} ({selectedStudent.email})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateStudent} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Ismi *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Familiyasi *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Telefon Raqami
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Biriktirilgan Guruh
                    </label>
                    <select
                      value={editForm.classRoomId || ''}
                      onChange={(e) => setEditForm({ ...editForm, classRoomId: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="">Guruh tanlanmagan</option>
                      {classrooms.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Holat (Status)
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="ACTIVE">Faol (Active)</option>
                      <option value="ARCHIVED">Arxivlangan (Archived)</option>
                      <option value="BLOCKED">Bloklangan (Blocked)</option>
                      <option value="SUSPENDED">To‘xtatilgan (Suspended)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tug‘ilgan Sanasi
                    </label>
                    <input
                      type="date"
                      value={editForm.birthDate || ''}
                      onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Yashash Manzili
                  </label>
                  <input
                    type="text"
                    value={editForm.address || ''}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={editForm.avatarUrl || ''}
                    onChange={(e) => setEditForm({ ...editForm, avatarUrl: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Bekor qilish
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    O‘zgarishlarni Saqlash
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};
