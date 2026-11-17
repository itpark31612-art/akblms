import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { coursesApi } from '../../api/courses.api';
import { ICourse, CreateCourseInput } from '@ems/shared';
import { Plus, Award, Trash2 } from 'lucide-react';

export const CoursesPage: React.FC = () => {
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

    setIsModalOpen(false);
    setNewCourse({ code: '', title: '', description: '', credits: 3 });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" kursini o‘chirishni tasdiqlaysizmi?`)) return;
    try {
      await coursesApi.delete(id);
    } catch {}
    setCourses(courses.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Kurslar & Fanlar Katalogi
          </h2>
          <p className="text-sm text-slate-500 mt-1">
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

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} hover className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                  {course.code}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  {course.credits} Kredit
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-3">{course.title}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {course.description || 'Tavsif berilmagan'}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">
                {course.teacherName
                  ? `Pedagog: ${course.teacherName}`
                  : 'O‘qituvchi: Biriktirilmagan'}
              </span>
              <button
                onClick={() => handleDelete(course.id, course.title)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Kursni o‘chirish"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fan Kodi</label>
              <input
                type="text"
                placeholder="CS-102"
                value={newCourse.code}
                onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 uppercase font-mono"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kurs Nomi</label>
              <input
                type="text"
                placeholder="Kiberxavfsizlik Asoslari"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kredit Miqdori
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={newCourse.credits}
              onChange={(e) => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
              className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tavsif</label>
            <textarea
              rows={3}
              placeholder="Kurs haqida qisqacha ma’lumot..."
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Saqlash & E’lon qilish
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
