import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../../design-system/components/Card';
import { Button } from '../../../design-system/components/Button';
import { Badge } from '../../../design-system/components/Badge';
import { Modal } from '../../../design-system/components/Modal';
import { useToast } from '../../../design-system/components/Toast';
import { PageTransition } from '../../../design-system/motion/PageTransition';
import { CounterAnimation } from '../../../design-system/motion/CounterAnimation';
import { StaggerContainer, StaggerItem } from '../../../design-system/motion/StaggerAnimation';
import { motion } from 'framer-motion';
import {
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  UserPlus,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  Award,
  RefreshCw,
  Download,
  FileSpreadsheet,
  Printer,
  Calendar,
  Clock,
  CheckCircle2,
  Bell,
  Activity,
  MapPin,
  ChevronRight,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from '../../../components/common/Charts';
import { analyticsApi, QuickStudentDto, QuickPaymentDto } from '../../../api/analytics.api';
import { usersApi } from '../../../api/users.api';
import { IAdminDashboardResponse, UserRole, UserSummary, PaymentMethodType } from '@ems/shared';

export const AdminDashboardView: React.FC = () => {
  const toast = useToast();

  // Holatlar
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [data, setData] = useState<IAdminDashboardResponse | null>(null);
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('month');

  // Modallar
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [studentsList, setStudentsList] = useState<UserSummary[]>([]);

  // Yangi o'quvchi formasi
  const [studentForm, setStudentForm] = useState<QuickStudentDto>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Tezkor to'lov formasi
  const [paymentForm, setPaymentForm] = useState<QuickPaymentDto>({
    studentId: '',
    amount: 1800000,
    paymentMethod: 'CLICK',
    description: 'Oylik o‘quv to‘lovi',
  });

  // Ma'lumotlarni yuklash
  const fetchDashboardData = useCallback(
    async (isManualRefresh = false) => {
      try {
        if (isManualRefresh) setRefreshing(true);
        else setLoading(true);

        const response = await analyticsApi.getAdminDashboard({ period });
        setData(response);

        if (isManualRefresh) {
          toast.success('Muvaffaqiyatli', 'Dashboard real ma’lumotlar asosida yangilandi');
        }
      } catch (err: any) {
        console.error('Dashboardni yuklashda xatolik:', err);
        toast.error('Xatolik yuz berdi', err.message || 'Dashboard ma’lumotlarini olib bo‘lmadi');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [period, toast]
  );

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Talabalar ro'yxatini to'lov modalida tanlash uchun olish
  const loadStudentsForPayment = async () => {
    try {
      const res = await usersApi.getUsers({ role: UserRole.STUDENT, pageSize: 50 });
      setStudentsList(res.items);
      if (res.items.length > 0 && !paymentForm.studentId) {
        setPaymentForm((prev) => ({ ...prev, studentId: res.items[0].id }));
      }
    } catch (err) {
      console.error('Talabalar ro‘yxatini yuklashda xato:', err);
    }
  };

  // Yangi o'quvchi qo'shish
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.firstName || !studentForm.lastName || !studentForm.email) {
      toast.warning('Eslatma', 'Barcha majburiy maydonlarni to‘ldiring');
      return;
    }

    try {
      await analyticsApi.createQuickStudent(studentForm);
      toast.success(
        'Qabul qilindi',
        `${studentForm.firstName} ${studentForm.lastName} o‘quvchilar ro‘yxatiga qo‘shildi`
      );
      setIsStudentModalOpen(false);
      setStudentForm({ firstName: '', lastName: '', email: '', phone: '' });
      fetchDashboardData(true);
    } catch (err: any) {
      toast.error('Xatolik', err.message || 'O‘quvchini qo‘shishda xatolik');
    }
  };

  // Tezkor to'lov qabul qilish
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.studentId || !paymentForm.amount) {
      toast.warning('Eslatma', 'O‘quvchi va summa to‘g‘ri kiritilishi shart');
      return;
    }

    try {
      await analyticsApi.recordQuickPayment(paymentForm);
      toast.success(
        'To‘lov qabul qilindi',
        `${Number(paymentForm.amount).toLocaleString('uz-UZ')} UZS muvaffaqiyatli saqlandi`
      );
      setIsPaymentModalOpen(false);
      fetchDashboardData(true);
    } catch (err: any) {
      toast.error('Xatolik', err.message || 'To‘lovni qabul qilishda xatolik');
    }
  };

  // Bildirishnomani o'qilgan deb belgilash
  const handleMarkNotification = async (id: string) => {
    try {
      await analyticsApi.markNotificationRead(id);
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          additional: {
            ...prev.additional,
            notifications: prev.additional.notifications.map((n) =>
              n.id === id ? { ...n, isRead: true } : n
            ),
          },
        };
      });
      toast.info('Bildirishnoma', 'Bildirishnoma o‘qildi deb belgilandi');
    } catch (err) {
      console.error(err);
    }
  };

  // CSV formatda eksport qilish
  const handleExportCSV = () => {
    if (!data) return;

    const csvRows = [
      ['KO‘RSATKICH', 'QIYMAT', 'IZOH'],
      ['Jami o‘quvchilar', data.stats.totalStudents, 'Faol o‘quvchilar soni'],
      ['Faol o‘qituvchilar', data.stats.activeTeachers, 'Akademik tarkib'],
      ['Guruhlar soni', data.stats.totalGroups, 'Sinflar va o‘quv guruhlari'],
      ['Bugungi davomat', `${data.stats.todayAttendance.rate}%`, `${data.stats.todayAttendance.present} kelgan / ${data.stats.todayAttendance.absent} kelmagan`],
      ['Oylik tushum (UZS)', data.stats.monthlyRevenue.amount, `+${data.stats.monthlyRevenue.growthPercent}% o‘sish`],
      ['Umumiy qarzdorlik (UZS)', data.stats.totalDebt.amount, `${data.stats.totalDebt.count} ta to‘lov muddati o‘tgan`],
      ['O‘rtacha test bali', `${data.stats.testResults.averageScore} ball`, `${data.stats.testResults.passingRate}% muvaffaqiyat ko‘rsatkichi`],
      ['Yangi ro‘yxatdan o‘tganlar', data.stats.newRegistrations.count, `+${data.stats.newRegistrations.growthPercent}% dinamika`],
      [],
      ['OY', 'DAROMAD (UZS)', 'REJA (UZS)'],
      ...data.charts.monthlyRevenue.map((m) => [m.month, m.revenue, m.target]),
      [],
      ['FAN NOMI', 'KODI', 'O‘RTACHA BALL', 'TALABALAR SONI', 'O‘TISH FOIZI'],
      ...data.charts.subjectPerformance.map((s) => [s.subject, s.code, s.averageScore, s.studentsCount, `${s.passRate}%`]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      csvRows.map((e) => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EMS_Admin_Dashboard_Hisobot_${period}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportMenuOpen(false);
    toast.success('Eksport muvaffaqiyatli', 'CSV hisoboti yuklab olindi');
  };

  // PDF / Chop etish eksporti
  const handleExportPDF = () => {
    setIsExportMenuOpen(false);
    toast.info('Chop etish rejimi', 'Brauzer orqali PDF sifatida saqlashingiz yoki chop etishingiz mumkin');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  // Formatlash utilitalari
  const formatUZS = (val: number) => {
    return new Intl.NumberFormat('uz-UZ').format(val) + ' UZS';
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Dashboard ma’lumotlarini yuklab bo‘lmadi
        </h3>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          Backend server yoki ma’lumotlar bazasi bilan aloqa mavjud emasligini tekshiring.
        </p>
        <Button variant="primary" onClick={() => fetchDashboardData()}>
          Qayta urinish
        </Button>
      </div>
    );
  }

  return (
    <PageTransition className="space-y-7 print:space-y-4">
      {/* 1. YUQORI BOSHQARUV PANELI VA FILTRLAR */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Admin Boshqaruv Dashboardi
            </h2>
            <Badge variant="success" size="sm" dot>
              Real Vaqt
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ta’lim ko‘rsatkichlari, tushumlar, qarzdorlik, davomat va pedagoglar to‘liq tahlili
          </p>
        </div>

        {/* Filtr va Amallar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sana davri filtri */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
            <button
              onClick={() => setPeriod('today')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                period === 'today'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Bugun
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                period === 'week'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Hafta
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                period === 'month'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Shu oy
            </button>
            <button
              onClick={() => setPeriod('year')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                period === 'year'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Yil
            </button>
          </div>

          {/* Yangilash */}
          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />}
            onClick={() => fetchDashboardData(true)}
            title="Real ma'lumotlarni bazadan qayta yuklash"
          >
            Yangilash
          </Button>

          {/* Eksport Menyu */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            >
              Eksport
            </Button>
            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-30">
                <button
                  onClick={handleExportCSV}
                  className="w-full px-3.5 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  CSV formatida yuklash
                </button>
                <button
                  onClick={handleExportPDF}
                  className="w-full px-3.5 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Printer className="w-4 h-4 text-indigo-600" />
                  PDF / Chop etish
                </button>
              </div>
            )}
          </div>

          {/* Tezkor amallar tugmalari */}
          <Button
            variant="outline"
            size="sm"
            icon={<CreditCard className="w-3.5 h-3.5 text-emerald-600" />}
            onClick={() => {
              loadStudentsForPayment();
              setIsPaymentModalOpen(true);
            }}
          >
            To‘lov qabul qilish
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<UserPlus className="w-4 h-4" />}
            onClick={() => setIsStudentModalOpen(true)}
          >
            Yangi Qabul
          </Button>
        </div>
      </div>

      {/* 2. STATISTIKA: 8 TA KO‘RSATKICH KARTASI (COUNTER ANIMATSIYALARI BILAN) */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        {/* 1. Jami o‘quvchilar */}
        <StaggerItem>
          <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>
            <Card hover accent="indigo" className="h-full flex flex-col justify-between p-4.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Jami O‘quvchilar
                  </p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                    <CounterAnimation value={data.stats.totalStudents} duration={1.2} />
                  </h3>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  +{data.stats.newRegistrations.growthPercent}% oylik o‘sish
                </span>
                <span className="text-[11px] text-slate-400">Faol hisoblar</span>
              </div>
            </Card>
          </motion.div>
        </StaggerItem>

        {/* 2. Faol ustozlar */}
        <StaggerItem>
          <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>
            <Card hover accent="emerald" className="h-full flex flex-col justify-between p-4.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Faol Ustozlar
                  </p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                    <CounterAnimation value={data.stats.activeTeachers} duration={1} />
                  </h3>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% sertifikatlangan
                </span>
                <span className="text-[11px] text-slate-400">8 fan kafedrasi</span>
              </div>
            </Card>
          </motion.div>
        </StaggerItem>

        {/* 3. Guruhlar soni */}
        <StaggerItem>
          <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>
            <Card hover accent="purple" className="h-full flex flex-col justify-between p-4.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Guruhlar Soni
                  </p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                    <CounterAnimation value={data.stats.totalGroups} duration={1} />
                  </h3>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>STEM & IT & Til</span>
                <span className="text-[11px] text-slate-400">7 ta sinfxona</span>
              </div>
            </Card>
          </motion.div>
        </StaggerItem>

        {/* 4. Bugungi davomat */}
        <StaggerItem>
          <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>
            <Card hover accent="indigo" className="h-full flex flex-col justify-between p-4.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Bugungi Davomat
                  </p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                    <CounterAnimation
                      value={data.stats.todayAttendance.rate}
                      decimals={1}
                      suffix="%"
                      duration={1.2}
                    />
                  </h3>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400">
                  <CalendarCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {data.stats.todayAttendance.present} kelgan
                </span>
                <span className="text-rose-500 font-bold">
                  {data.stats.todayAttendance.absent} kelmagan
                </span>
                <span className="text-amber-500 font-bold">
                  {data.stats.todayAttendance.late} kechikkan
                </span>
              </div>
            </Card>
          </motion.div>
        </StaggerItem>

        {/* 5. Oylik tushum */}
        <StaggerItem>
          <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>
            <Card hover accent="emerald" className="h-full flex flex-col justify-between p-4.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Oylik Tushum
                  </p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                    <CounterAnimation
                      value={data.stats.monthlyRevenue.amount / 1000000}
                      decimals={1}
                      suffix=" mln"
                      duration={1.4}
                    />
                  </h3>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  +{data.stats.monthlyRevenue.growthPercent}% o‘tgan oyga nisbatan
                </span>
              </div>
            </Card>
          </motion.div>
        </StaggerItem>

        {/* 6. Umumiy qarzdorlik */}
        <StaggerItem>
          <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>
            <Card hover accent="none" className="h-full flex flex-col justify-between p-4.5 border-rose-200 dark:border-rose-900/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Umumiy Qarzdorlik
                  </p>
                  <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
                    <CounterAnimation
                      value={data.stats.totalDebt.amount / 1000000}
                      decimals={1}
                      suffix=" mln"
                      duration={1.2}
                    />
                  </h3>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-rose-500">
                <span>{data.stats.totalDebt.count} nafar o‘quvchi muddati o‘tgan</span>
                <span className="text-[11px] underline cursor-pointer" onClick={() => setIsPaymentModalOpen(true)}>
                  To‘lov olish
                </span>
              </div>
            </Card>
          </motion.div>
        </StaggerItem>

        {/* 7. Test natijalari */}
        <StaggerItem>
          <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>
            <Card hover accent="amber" className="h-full flex flex-col justify-between p-4.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Test Natijalari
                  </p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                    <CounterAnimation
                      value={data.stats.testResults.averageScore}
                      decimals={1}
                      suffix=" ball"
                      duration={1.2}
                    />
                  </h3>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
                <span>{data.stats.testResults.passingRate}% o‘tish ko‘rsatkichi</span>
                <span className="text-[11px] text-slate-400">{data.stats.testResults.totalGraded} ta test</span>
              </div>
            </Card>
          </motion.div>
        </StaggerItem>

        {/* 8. Yangi ro‘yxatdan o‘tganlar */}
        <StaggerItem>
          <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>
            <Card hover accent="indigo" className="h-full flex flex-col justify-between p-4.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Yangi Ro‘yxatdan O‘tganlar
                  </p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
                    <CounterAnimation value={data.stats.newRegistrations.count} duration={1} />
                  </h3>
                </div>
                <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-400">
                  <UserPlus className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                <span className="flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  +{data.stats.newRegistrations.growthPercent}% o‘tgan oyga nisbatan
                </span>
                <span className="text-[11px] text-slate-400">So‘nggi 30 kun</span>
              </div>
            </Card>
          </motion.div>
        </StaggerItem>
      </StaggerContainer>

      {/* 3. GRAFIKLAR: 5 TA ASOSIY TAHLILIY GRAFIK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Oylik daromad grafigi (AreaChart) */}
        <Card className="lg:col-span-8 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                Oylik Daromad Grafigi (Tushum va Reja)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Oxirgi 6 oylik to‘lovlar va belgilangan moliyaviy reja tahlili (UZS)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Haqiqiy Tushum
              </span>
              <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> Moliyaviy Reja
              </span>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.charts.monthlyRevenue}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val: number) => `${(val / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  formatter={(val: number) => [formatUZS(val), 'Summa']}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderRadius: '8px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#818cf8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#targetGradient)"
                  name="Moliyaviy Reja"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                  name="Haqiqiy Tushum"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 2. To‘lovlar statistikasi (Pie/Donut Chart & Taqsimot) */}
        <Card className="lg:col-span-4 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-500" />
              To‘lovlar Statistikasi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Holat va to‘lov usullari bo‘yicha taqsimot
            </p>

            <div className="h-44 w-full mt-2 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.charts.paymentStats.statusBreakdown}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.charts.paymentStats.statusBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: number) => formatUZS(val)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center pointer-events-none">
                <span className="text-[10px] uppercase font-bold text-slate-400">Jami Balans</span>
                <p className="text-sm font-black text-slate-800 dark:text-slate-200">
                  {((data.stats.monthlyRevenue.amount + data.stats.totalDebt.amount) / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>

            {/* Holatlar bo'yicha ko'rsatkichlar */}
            <div className="space-y-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              {data.charts.paymentStats.statusBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {formatUZS(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* To'lov usullari (Payme, Click, Uzum, Naqd) */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Eng ko‘p ishlatilgan to‘lov usullari:
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              {data.charts.paymentStats.methodBreakdown.slice(0, 3).map((m, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{m.name}</p>
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {(m.amount / 1000000).toFixed(1)}M
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3. O‘quvchilar soni o‘sishi (AreaChart) */}
        <Card className="lg:col-span-6 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                O‘quvchilar Soni O‘sishi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Oylar kesimida umumiy va yangi qabul qilingan o‘quvchilar
              </p>
            </div>
            <Badge variant="info" size="sm">
              +{data.stats.newRegistrations.growthPercent}% o‘sish
            </Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.charts.studentGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="studentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderRadius: '8px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="totalStudents"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#studentGradient)"
                  name="Jami O‘quvchilar"
                />
                <Bar dataKey="newStudents" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Yangi Qabul" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 4. Davomat dinamikasi (BarChart) */}
        <Card className="lg:col-span-6 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-500" />
                Davomat Dinamikasi (Oxirgi 7 kun)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Kunlik ishtirok darajasi va kelmaganlar nisbati
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Kelgan
              </span>
              <span className="flex items-center gap-1.5 text-rose-500">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Kelmagan
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.charts.attendanceDynamics}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderRadius: '8px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} name="Kelgan" />
                <Bar dataKey="absent" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Kelmagan" />
                <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Kechikkan" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* 5. Fanlar bo‘yicha natijalar (BarChart) */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Fanlar Bo‘yicha Natijalar (Akademik O‘zlashtirish)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Har bir fan bo‘yicha oraliq imtihonlarning o‘rtacha balli va talabalar soni
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-500">
            Maksimal ball: <span className="text-slate-900 dark:text-slate-100 font-bold">100 ball</span>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.charts.subjectPerformance}
              margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
              <XAxis
                dataKey="subject"
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                formatter={(val: number, name: string) => [
                  name === 'O‘rtacha Ball' ? `${val} ball` : `${val}%`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  borderRadius: '8px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="averageScore" fill="#6366f1" radius={[4, 4, 0, 0]} name="O‘rtacha Ball" />
              <Bar dataKey="passRate" fill="#10b981" radius={[4, 4, 0, 0]} name="O‘tish Foizi (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 4. QO‘SHIMCHA: BUGUNGI DARSLAR, OXIRGI FAOLIYATLAR VA BILDIRISHNOMALAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* A) Bugungi Darslar Jadvali */}
        <Card className="lg:col-span-5 p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                Bugungi Darslar Jadvali
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Bugun bo‘lib o‘tadigan dars mashg‘ulotlari
              </p>
            </div>
            <Badge variant="info" size="sm">
              {data.additional.todayLessons.length} ta dars
            </Badge>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {data.additional.todayLessons.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">Bugun uchun dars jadvali belgilanmagan</p>
            ) : (
              data.additional.todayLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {lesson.courseName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold">
                        {lesson.courseCode}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3">
                      <span>Ustoz: {lesson.teacherName}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {lesson.roomNumber} ({lesson.classRoomName})
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/80 px-2 py-1 rounded-lg">
                      {lesson.startTime} - {lesson.endTime}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* B) Oxirgi Faoliyatlar (Audit Logs) */}
        <Card className="lg:col-span-4 p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                Oxirgi Faoliyatlar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tizimda sodir bo‘lgan so‘nggi hodisalar
              </p>
            </div>
            <Badge variant="purple" size="sm">Audit Log</Badge>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {data.additional.recentActivities.map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/30 text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <Badge
                    variant={
                      act.action.includes('PAYMENT')
                        ? 'success'
                        : act.action.includes('STUDENT')
                        ? 'info'
                        : act.action.includes('ATTENDANCE')
                        ? 'info'
                        : 'warning'
                    }
                    size="sm"
                  >
                    {act.action}
                  </Badge>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {new Date(act.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium mt-1.5 leading-relaxed">
                  {act.details || act.resource}
                </p>
                {act.userEmail && (
                  <p className="text-[10px] text-slate-400 mt-1">Ijrochi: {act.userEmail}</p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* C) Muhim Bildirishnomalar */}
        <Card className="lg:col-span-3 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                Bildirishnomalar
              </h3>
              <Badge variant="danger" size="sm" dot>
                {data.additional.notifications.filter((n) => !n.isRead).length} ta yangi
              </Badge>
            </div>

            <div className="space-y-2.5 max-h-[320px] overflow-y-auto">
              {data.additional.notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border transition-all text-xs ${
                    n.isRead
                      ? 'border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900/50 opacity-70'
                      : 'border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{n.title}</p>
                    <Badge
                      variant={
                        n.type === 'URGENT'
                          ? 'danger'
                          : n.type === 'WARNING'
                          ? 'warning'
                          : n.type === 'SUCCESS'
                          ? 'success'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {n.type}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-1 line-clamp-2">
                    {n.message}
                  </p>
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkNotification(n.id)}
                      className="mt-2 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      O‘qildi deb belgilash <ChevronRight className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => toast.info('Bildirishnomalar', 'Barcha bildirishnomalar sahifasiga o‘tildi')}
            >
              Barcha bildirishnomalar
            </Button>
          </div>
        </Card>
      </div>

      {/* 5. MODALLAR: TEZKOR AMALLAR */}
      {/* Modal 1: Yangi O'quvchi Qabul Qilish */}
      <Modal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        title="Yangi O‘quvchi Qabul Qilish"
        description="O‘quvchini tizimga tezkor ro‘yxatga olish anketasi"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ismi *
              </label>
              <input
                type="text"
                required
                value={studentForm.firstName}
                onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })}
                placeholder="Masalan: Sardor"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Familiyasi *
              </label>
              <input
                type="text"
                required
                value={studentForm.lastName}
                onChange={(e) => setStudentForm({ ...studentForm, lastName: e.target.value })}
                placeholder="Masalan: Olimov"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Elektron pochta (Email) *
            </label>
            <input
              type="email"
              required
              value={studentForm.email}
              onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
              placeholder="sardor.olimov@ems.local"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Telefon raqami
            </label>
            <input
              type="tel"
              value={studentForm.phone}
              onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
              placeholder="+998 90 123 45 67"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsStudentModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" size="sm" type="submit" icon={<UserPlus className="w-4 h-4" />}>
              Ro‘yxatdan o‘tkazish
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Tezkor To'lov Qabul Qilish */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="O‘quv To‘lovini Qabul Qilish"
        description="O‘quvchining shartnoma yoki kurs to‘lovini kiritish"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              O‘quvchini tanlang *
            </label>
            <select
              required
              value={paymentForm.studentId}
              onChange={(e) => setPaymentForm({ ...paymentForm, studentId: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {studentsList.length === 0 ? (
                <option value="">O‘quvchilar yuklanmoqda...</option>
              ) : (
                studentsList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} ({s.email})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                To‘lov summasi (UZS) *
              </label>
              <input
                type="number"
                required
                min={50000}
                step={50000}
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                To‘lov usuli *
              </label>
              <select
                value={paymentForm.paymentMethod}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, paymentMethod: e.target.value as PaymentMethodType })
                }
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="CLICK">Click</option>
                <option value="PAYME">Payme</option>
                <option value="UZUM">Uzum Bank</option>
                <option value="CASH">Naqd pul</option>
                <option value="BANK_TRANSFER">Bank o‘tkazmasi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              To‘lov maqsadi / Izoh
            </label>
            <input
              type="text"
              value={paymentForm.description}
              onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
              placeholder="Oylik to‘lov yoki imtihon badali"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsPaymentModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" size="sm" type="submit" icon={<CreditCard className="w-4 h-4" />}>
              To‘lovni tasdiqlash
            </Button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
};
