import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(
    '🌱 EMS ma’lumotlar bazasini boshlang‘ich ma’lumotlar bilan to‘ldirish (Seeding) boshlandi...'
  );

  const defaultPassword = await bcrypt.hash('Admin123!', 10);
  const teacherPassword = await bcrypt.hash('Teacher123!', 10);
  const studentPassword = await bcrypt.hash('Student123!', 10);
  const parentPassword = await bcrypt.hash('Parent123!', 10);

  // 1. Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@ems.local' },
    update: {},
    create: {
      email: 'superadmin@ems.local',
      passwordHash: defaultPassword,
      firstName: 'Sanjar',
      lastName: 'Karimov',
      role: Role.SUPER_ADMIN,
      phone: '+998901234567',
      isActive: true,
    },
  });
  console.log(`✅ Super Admin yaratildi: ${superAdmin.email}`);

  // 2. School Admin
  const schoolAdmin = await prisma.user.upsert({
    where: { email: 'admin@ems.local' },
    update: {},
    create: {
      email: 'admin@ems.local',
      passwordHash: defaultPassword,
      firstName: 'Malika',
      lastName: 'Raximova',
      role: Role.ADMIN,
      phone: '+998902345678',
      isActive: true,
    },
  });
  console.log(`✅ Maktab Admini yaratildi: ${schoolAdmin.email}`);

  // 3. Teacher
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@ems.local' },
    update: {},
    create: {
      email: 'teacher@ems.local',
      passwordHash: teacherPassword,
      firstName: 'Bobur',
      lastName: 'Mirzayev',
      role: Role.TEACHER,
      phone: '+998903456789',
      isActive: true,
    },
  });
  console.log(`✅ O‘qituvchi yaratildi: ${teacher.email}`);

  // 4. Student
  const student = await prisma.user.upsert({
    where: { email: 'student@ems.local' },
    update: {},
    create: {
      email: 'student@ems.local',
      passwordHash: studentPassword,
      firstName: 'Alisher',
      lastName: 'Sobirov',
      role: Role.STUDENT,
      phone: '+998904567890',
      isActive: true,
    },
  });
  console.log(`✅ O‘quvchi yaratildi: ${student.email}`);

  // 5. Parent
  const parent = await prisma.user.upsert({
    where: { email: 'parent@ems.local' },
    update: {},
    create: {
      email: 'parent@ems.local',
      passwordHash: parentPassword,
      firstName: 'Akbarbek',
      lastName: 'Sobirov',
      role: Role.PARENT,
      phone: '+998905678901',
      isActive: true,
    },
  });
  console.log(`✅ Ota-ona yaratildi: ${parent.email}`);

  // 6. Parent - Student aloqasi
  await prisma.parentStudent.upsert({
    where: {
      parentId_studentId: {
        parentId: parent.id,
        studentId: student.id,
      },
    },
    update: {},
    create: {
      parentId: parent.id,
      studentId: student.id,
      relationship: 'FATHER',
    },
  });

  // 7. Namunaviy Maktab
  const school = await prisma.school.upsert({
    where: { code: 'SCH-001' },
    update: {},
    create: {
      name: 'Toshkent Xalqaro Ta’lim Akademiyasi',
      code: 'SCH-001',
      address: 'Toshkent shahri, Yunusobod tumani, Amir Temur ko‘chasi, 45-uy',
      phone: '+998712001122',
      email: 'info@ti-academy.uz',
    },
  });
  console.log(`✅ Namunaviy maktab yaratildi: ${school.name}`);

  // 8. Namunaviy Kurslar
  const courses = [
    {
      code: 'CS-101',
      title: 'Dasturlash Asoslari & Algoritmlar',
      description: 'Zamonaviy dasturlash tillari, algoritmlar va ma’lumotlar tuzilmalari',
      credits: 4,
      teacherId: teacher.id,
    },
    {
      code: 'MATH-201',
      title: 'Oliy Matematika va Chiziqli Algebra',
      description: 'Differensial hisob, matritsalar va vektor fazolari',
      credits: 3,
      teacherId: teacher.id,
    },
    {
      code: 'ENG-301',
      title: 'Akademik Ingliz Tili (IELTS / CEFR B2+)',
      description: 'Ilmiy maqolalar yozish va akademik muloqot ko‘nikmalari',
      credits: 2,
    },
  ];

  for (const c of courses) {
    await prisma.course.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }
  console.log(`✅ ${courses.length} ta namunaviy kurs yaratildi`);

  console.log('\n🎉 Boshlang‘ich ma’lumotlar muvaffaqiyatli saqlandi!');
  console.log('----------------------------------------------------');
  console.log('Kirish uchun hisoblar:');
  console.log('👑 Super Admin : superadmin@ems.local / Admin123!');
  console.log('🏢 Admin       : admin@ems.local      / Admin123!');
  console.log('👨‍🏫 O‘qituvchi   : teacher@ems.local    / Teacher123!');
  console.log('👨‍🎓 O‘quvchi    : student@ems.local    / Student123!');
  console.log('👨‍👩‍👦 Ota-ona     : parent@ems.local     / Parent123!');
  console.log('----------------------------------------------------\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding jarayonida xatolik:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
