import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import { Badge } from '../../design-system/components/Badge';
import { Modal } from '../../design-system/components/Modal';
import { useToast } from '../../design-system/components/Toast';
import { PageTransition } from '../../design-system/motion/PageTransition';
import { CounterAnimation } from '../../design-system/motion/CounterAnimation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  GraduationCap,
  CreditCard,
  Award,
  CalendarCheck,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  User,
  Archive,
  RotateCcw,
  BookOpen,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import { studentsApi } from '../../api/students.api';
import { analyticsApi } from '../../api/analytics.api';
import { IStudentProfile, PaymentMethodType } from '@ems/shared';

export const StudentProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [profile, setProfile] = useState<IStudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'courses' | 'attendance' | 'payments' | 'grades' | 'info'>('courses');

  // Modallar
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(1800000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('CLICK');
  const [paymentDesc, setPaymentDesc] = useState('Oylik o‘quv badali');

  // Profil ma'lumotlarini yuklash
  const fetchProfile = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await studentsApi.getStudentProfile(id);
      setProfile(data);
    } catch (err: any) {
      console.error('O‘quvchi profilini yuklashda xato:', err);
      toast.error('Xatolik', err.message || 'Profil ma’lumotlarini yuklab bo‘lmadi');
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Tezkor to'lov qabul qilish
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !paymentAmount) return;

    try {
      await analyticsApi.recordQuickPayment({
        studentId: id,
        amount: Number(paymentAmount),
        paymentMethod,
        description: paymentDesc,
      });

      toast.success(
        'To‘lov qabul qilindi',
        `${Number(paymentAmount).toLocaleString('uz-UZ')} UZS muvaffaqiyatli saqlandi`
      );
      setIsPaymentModalOpen(false);
      fetchProfile();
    } catch (err: any) {
      toast.error('Xatolik', err.message || 'To‘lovni saqlashda xatolik yuz berdi');
    }
  };

  // Arxivlash / Arxivdan chiqarish
  const handleToggleArchive = async () => {
    if (!profile) return;
    const isArchived = profile.student.status === 'ARCHIVED';
    const actionText = isArchived ? 'arxivdan chiqarish' : 'arxivlash';

    if (!confirm(`${profile.student.firstName} hisobini ${actionText}ni tasdiqlaysizmi?`)) {
      return;
    }

    try {
      await studentsApi.archiveStudent(profile.student.id, !isArchived);
      toast.success(
        isArchived ? 'Arxivdan chiqarildi' : 'Arxivlandi',
        'O‘quvchi holati muvaffaqiyatli o‘zgartirildi'
      );
      fetchProfile();
    } catch (err: any) {
      toast.error('Xatolik', err.message || 'Holatni o‘zgartirishda xatolik');
    }
  };

  const formatUZS = (val: number) => {
    return new Intl.NumberFormat('uz-UZ').format(val) + ' UZS';
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/4"></div>
        <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-12 text-center">
        <GraduationCap className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">O‘quvchi topilmadi</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Bunday o‘quvchi tizimda mavjud emas yoki o‘chirilgan bo‘lishi mumkin.
        </p>
        <Button variant="primary" onClick={() => navigate('/students')}>
          O‘quvchilar ro‘yxatiga qaytish
        </Button>
      </div>
    );
  }

  const { student, classRoom, parent, enrollments, attendances, attendanceStats, grades, academicStats, payments, paymentStats } =
    profile;

  return (
    <PageTransition className="space-y-6">
      {/* 1. ORQAGA QAYTISH VA AMALLAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/students')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          O‘quvchilar ro‘yxatiga qaytish
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<CreditCard className="w-4 h-4 text-emerald-600" />}
            onClick={() => setIsPaymentModalOpen(true)}
          >
            To‘lov qabul qilish
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={
              student.status === 'ARCHIVED' ? (
                <RotateCcw className="w-4 h-4 text-amber-500" />
              ) : (
                <Archive className="w-4 h-4 text-slate-500" />
              )
            }
            onClick={handleToggleArchive}
          >
            {student.status === 'ARCHIVED' ? 'Arxivdan chiqarish' : 'Arxivlash'}
          </Button>
        </div>
      </div>

      {/* 2. PROFIL BOSHQARUV KARTASI (HEADER) */}
      <Card className="p-6 relative overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Profil rasmi */}
            <div className="relative">
              {student.avatarUrl ? (
                <img
                  src={student.avatarUrl}
                  alt={`${student.firstName} ${student.lastName}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-indigo-500/10 shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-lg">
                  {student.firstName[0]}
                  {student.lastName[0]}
                </div>
              )}
              <span
                className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 ${
                  student.status === 'ACTIVE'
                    ? 'bg-emerald-500'
                    : student.status === 'ARCHIVED'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              />
            </div>

            {/* Ism, ID, Guruh */}
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {student.firstName} {student.lastName}
                </h1>
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
                    ? 'Faol O‘quvchi'
                    : student.status === 'ARCHIVED'
                    ? 'Arxivlangan'
                    : 'Bloklangan'}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">
                <span className="font-mono px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                  ID: {student.studentCode}
                </span>

                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  {classRoom?.name || 'Guruh biriktirilmagan'}
                </span>

                {student.phone && (
                  <span className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {student.phone}
                  </span>
                )}

                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {student.email}
                </span>
              </div>
            </div>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400">Ro‘yxatdan o‘tgan sana:</span>
            <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
              {new Date(student.createdAt).toLocaleDateString('uz-UZ')}
            </span>
          </div>
        </div>
      </Card>

      {/* 3. 4 TA ASOSIY KPI KARTALARI (HOVER EFFEKTLAR BILAN) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Ballar balansi & GPA */}
        <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <Card hover accent="amber" className="h-full p-4.5 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Ballar Balansi (GPA)
                </p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={academicStats.gpa} decimals={2} duration={1.2} /> / 4.0
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span>O‘rtacha: {academicStats.averageScore} ball</span>
              <span>{academicStats.passRate}% o‘tish</span>
            </div>
          </Card>
        </motion.div>

        {/* 2. Davomat ko'rsatkichi */}
        <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <Card hover accent="emerald" className="h-full p-4.5 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Davomat Ko‘rsatkichi
                </p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={attendanceStats.rate} decimals={1} suffix="%" duration={1.2} />
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span className="text-emerald-600">{attendanceStats.present} kelgan</span>
              <span className="text-rose-500">{attendanceStats.absent} kelmagan</span>
              <span className="text-amber-500">{attendanceStats.late} kechikkan</span>
            </div>
          </Card>
        </motion.div>

        {/* 3. To'lovlar balansi */}
        <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <Card hover accent="indigo" className="h-full p-4.5 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Jami To‘langan Summa
                </p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation
                    value={paymentStats.totalPaid / 1000000}
                    decimals={1}
                    suffix=" mln"
                    duration={1.2}
                  />
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
              {paymentStats.totalOverdue > 0 || paymentStats.totalPending > 0 ? (
                <span className="text-rose-500 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Qarzdorlik: {formatUZS(paymentStats.totalPending + paymentStats.totalOverdue)}
                </span>
              ) : (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Qarzdorlik yo‘q
                </span>
              )}
            </div>
          </Card>
        </motion.div>

        {/* 4. Biriktirilgan Kurslar soni */}
        <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>
          <Card hover accent="purple" className="h-full p-4.5 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Faol Kurslar & Fanlar
                </p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                  <CounterAnimation value={enrollments.length} duration={1} /> ta fan
                </h3>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Jami kreditlar: {enrollments.reduce((acc, e) => acc + e.credits, 0)}</span>
              <span>{classRoom?.academicYear || '2026-2027'}</span>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* 4. TABLAR: O‘QISH TARIXI, DAVOMAT, TO‘LOVLAR, TEST NATIJALARI, MA'LUMOTLAR */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'courses'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            O‘qish Tarixi & Kurslar ({enrollments.length})
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'attendance'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            Davomat Tarixi ({attendances.length})
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'payments'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            To‘lovlar Tarixi ({payments.length})
          </button>

          <button
            onClick={() => setActiveTab('grades')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'grades'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            Test Natijalari ({grades.length})
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'info'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            Shaxsiy & Ota-onasi
          </button>
        </div>
      </div>

      {/* 5. TABLAR ICHIDAGI KONTENT */}
      {/* TAB 1: O‘QISH TARIXI & KURSLAR */}
      {activeTab === 'courses' && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Biriktirilgan Kurslar va Fanlar Ro‘yxati
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Talabaning joriy semestrdagi o‘quv rejasi va pedagoglar tarkibi
              </p>
            </div>
            <Badge variant="info" size="sm">
              {enrollments.length} ta faol kurs
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.map((enr) => (
              <div
                key={enr.id}
                className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      {enr.courseCode}
                    </span>
                    <Badge variant="success" size="sm">
                      {enr.status}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                    {enr.courseTitle}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    O‘qituvchi: {enr.teacherName || 'Biriktirilmagan'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Kredit: {enr.credits} ECTS</span>
                  <span>Qabul: {new Date(enr.enrolledAt).toLocaleDateString('uz-UZ')}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 2: DAVOMAT TARIXI */}
      {activeTab === 'attendance' && (
        <Card className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Davomat Tarixi va Ishtirok Jurnali
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Barcha dars mashg‘ulotlaridagi ishtirok, sababli va kechikishlar
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="text-emerald-600">{attendanceStats.present} Kelgan</span>
              <span className="text-rose-500">{attendanceStats.absent} Sababsiz</span>
              <span className="text-amber-500">{attendanceStats.late} Kechikkan</span>
              <span className="text-blue-500">{attendanceStats.excused} Sababli</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Sana</th>
                  <th className="py-3 px-4">Fan Nomi</th>
                  <th className="py-3 px-4">Holat</th>
                  <th className="py-3 px-4">Izoh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {attendances.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {new Date(att.date).toLocaleDateString('uz-UZ', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {att.courseName}
                    </td>
                    <td className="py-2.5 px-4">
                      <Badge
                        variant={
                          att.status === 'PRESENT'
                            ? 'success'
                            : att.status === 'EXCUSED'
                            ? 'info'
                            : att.status === 'LATE'
                            ? 'warning'
                            : 'danger'
                        }
                        size="sm"
                      >
                        {att.status === 'PRESENT'
                          ? 'Kelgan'
                          : att.status === 'EXCUSED'
                          ? 'Sababli'
                          : att.status === 'LATE'
                          ? 'Kechikkan'
                          : 'Kelmagan'}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-4 text-slate-400">
                      {att.remarks || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: TO‘LOVLAR TARIXI */}
      {activeTab === 'payments' && (
        <Card className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                To‘lovlar Tarixi va Moliyaviy Holat
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Barcha to‘langan cheklar, kutilayotgan summalar va hisob-fakturalar
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<CreditCard className="w-4 h-4" />}
              onClick={() => setIsPaymentModalOpen(true)}
            >
              Yangi To‘lov Kiritish
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Invoice / Chek</th>
                  <th className="py-3 px-4">Summa</th>
                  <th className="py-3 px-4">To‘lov Usuli</th>
                  <th className="py-3 px-4">Sanasi</th>
                  <th className="py-3 px-4">Holat</th>
                  <th className="py-3 px-4">Tafsilot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {p.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {formatUZS(p.paidAmount || p.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
                        {p.paymentMethod || '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {p.paidAt
                        ? new Date(p.paidAt).toLocaleDateString('uz-UZ')
                        : new Date(p.dueDate).toLocaleDateString('uz-UZ')}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          p.status === 'PAID'
                            ? 'success'
                            : p.status === 'OVERDUE'
                            ? 'danger'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {p.status === 'PAID'
                          ? 'To‘langan'
                          : p.status === 'OVERDUE'
                          ? 'Muddati o‘tgan'
                          : 'Kutilmoqda'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-400 truncate max-w-xs">
                      {p.description || 'O‘quv badali'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 4: TEST NATIJALARI */}
      {activeTab === 'grades' && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Test va Oraliq Nazorat Natijalari
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                O‘quvchining fanlar bo‘yicha to‘plagan ballari va o‘qituvchi sharhlari
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-amber-600">
                GPA: {academicStats.gpa.toFixed(2)}
              </span>
              <Badge variant="success" size="sm">
                O‘rtacha: {academicStats.averageScore} ball
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            {grades.map((g) => (
              <div
                key={g.id}
                className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {g.courseName}
                    </span>
                    <Badge variant={g.type === 'EXAM' ? 'purple' : 'info'} size="sm">
                      {g.type}
                    </Badge>
                  </div>
                  <p className="text-slate-500 italic mt-1">"{g.feedback || 'Izoh yo‘q'}"</p>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                      {g.score}
                    </span>
                    <span className="text-slate-400"> / {g.maxScore} ball</span>
                  </div>
                  <Badge
                    variant={
                      g.score >= 90
                        ? 'success'
                        : g.score >= 80
                        ? 'info'
                        : g.score >= 60
                        ? 'warning'
                        : 'danger'
                    }
                    size="sm"
                  >
                    {Math.round((g.score / g.maxScore) * 100)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 5: SHAXSIY MA'LUMOTLAR & OTA-ONASI */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500" />
              O‘quvchining Shaxsiy Ma’lumotlari
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">To‘liq Ismi:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {student.firstName} {student.lastName}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Student ID Kodu:</span>
                <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {student.studentCode}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Elektron Pochta:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {student.email}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Telefon:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {student.phone || 'Kiritilmagan'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Tug‘ilgan Sanasi:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {student.birthDate ? new Date(student.birthDate).toLocaleDateString('uz-UZ') : '—'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Yashash Manzili:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {student.address || 'Kiritilmagan'}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Ota-onasi / Vasiysi Haqida Ma’lumot
            </h3>
            {parent ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Ota-onasi / Vasiy:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {parent.firstName} {parent.lastName}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Qarindoshlik Aloqasi:</span>
                  <Badge variant="purple" size="sm">
                    {parent.relationship}
                  </Badge>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Aloqa Telefoni:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {parent.phone || 'Mavjud emas'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Elektron Pochta:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {parent.email}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                Ushbu o‘quvchiga ota-ona hisobi hali biriktirilmagan
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TO‘LOV QABUL QILISH MODALI */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="O‘quv To‘lovini Qabul Qilish"
        description={`${student.firstName} ${student.lastName} (${student.studentCode}) uchun to‘lov`}
      >
        <form onSubmit={handleRecordPayment} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              To‘lov Summasi (UZS) *
            </label>
            <input
              type="number"
              required
              min={50000}
              step={50000}
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              To‘lov Tizimi / Usuli *
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethodType)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="CLICK">Click</option>
              <option value="PAYME">Payme</option>
              <option value="UZUM">Uzum Bank</option>
              <option value="CASH">Naqd Pul</option>
              <option value="BANK_TRANSFER">Bank O‘tkazmasi</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              To‘lov Maqsadi / Izoh
            </label>
            <input
              type="text"
              value={paymentDesc}
              onChange={(e) => setPaymentDesc(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsPaymentModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" size="sm" type="submit" icon={<CreditCard className="w-4 h-4" />}>
              To‘lovni Tasdiqlash
            </Button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
};
