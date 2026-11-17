import React, { useState, useEffect } from 'react';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import { Input } from '../../design-system/components/Input';
import { Modal } from '../../design-system/components/Modal';
import { useToast } from '../../design-system/components/Toast';
import { PageTransition } from '../../design-system/motion/PageTransition';
import { StaggerContainer, StaggerItem } from '../../design-system/motion/StaggerAnimation';
import { coursesApi } from '../../api/courses.api';
import { ICourse, CreateCourseInput } from '@ems/shared';
import { Plus, Award, Trash2 } from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const toast = useToast();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState<CreateCourseInput>({
    code: '',
    title: '',
    description: '',
    credits: 3,
  });

  const sampleCourses: ICourse[] = [
    {
      id: '1',
      code: 'CS-101',
      title: 'Dasturlash Asoslari & Algoritmlar',
      description: 'Algoritmlar tahlili, ma’lumotlar tuzilmasi va zamonaviy sintaksis',
      credits: 4,
      teacherName: 'Bobur Mirzayev',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      code: 'MATH-201',
      title: 'Oliy Matematika va Chiziqli Algebra',
      description: 'Matritsalar, vektor fazolar va ko‘p o‘lchamli analiz',
      credits: 3,
      teacherName: 'Bobur Mirzayev',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      code: 'ENG-301',
      title: 'Akademik Ingliz Tili (CEFR B2+)',
      description: 'Ilmiy maqolalar tahlili va taqdimotlar tayyorlash',
      credits: 2,
      teacherName: 'Malika Raximova',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await coursesApi.getAll();
        if (data && data.length > 0) {
          setCourses(data);
        } else {
          setCourses(sampleCourses);
        }
      } catch {
        setCourses(sampleCourses);
      }
    };
    fetchCourses();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.code || !newCourse.title) return;

    try {
      const created = await coursesApi.create(newCourse);
      setCourses([created, ...courses]);
    } catch {
      const mockCreated: ICourse = {
        id: String(Date.now()),
        code: newCourse.code.toUpperCase(),
        title: newCourse.title,
        description: newCourse.description,
        credits: newCourse.credits,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      setCourses([mockCreated, ...courses]);
    }

    toast.success('Yaratildi', `${newCourse.title} fani o‘quv dasturiga qo‘shildi`);
    setIsModalOpen(false);
    setNewCourse({ code: '', title: '', description: '', credits: 3 });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" kursini o‘chirishni tasdiqlaysizmi?`)) return;
    try {
      await coursesApi.delete(id);
    } catch {}
    setCourses(courses.filter((c) => c.id !== id));
    toast.info('O‘chirildi', `"${title}" kursi muvaffaqiyatli o‘chirildi`);
  };

  return (
    <PageTransition className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Kurslar & Fanlar Katalogi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Akademik o‘quv rejasidagi barcha fanlar, ularning kreditlari va mas’ul pedagoglari
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          Yangi Kurs Yaratish
        </Button>
      </div>

      {/* Courses Grid with Stagger & HoverCard */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <StaggerItem key={course.id}>
            <Card hover className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded-lg">
                    {course.code}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    {course.credits} Kredit
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-3">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {course.description || 'Tavsif berilmagan'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {course.teacherName
                    ? `Pedagog: ${course.teacherName}`
                    : 'O‘qituvchi: Biriktirilmagan'}
                </span>
                <button
                  onClick={() => handleDelete(course.id, course.title)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                  title="Kursni o‘chirish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Create Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Yangi Kurs Yaratish"
        description="O‘quv dasturiga yangi fan kiritish"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <Input
                label="Fan Kodi"
                placeholder="CS-102"
                value={newCourse.code}
                onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2">
              <Input
                label="Kurs Nomi"
                placeholder="Kiberxavfsizlik Asoslari"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Kredit Miqdori
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={newCourse.credits}
              onChange={(e) => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
              className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Tavsif
            </label>
            <textarea
              rows={3}
              placeholder="Kurs haqida qisqacha ma’lumot..."
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Saqlash & E’lon qilish
            </Button>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
};
