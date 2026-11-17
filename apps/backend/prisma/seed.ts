import { PrismaClient, Role, PaymentStatus, PaymentMethod, AttendanceStatus, GradeType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 EMS ma’lumotlar bazasini boyitish (Seeding) boshlandi...');

  const defaultPassword = await bcrypt.hash('Admin123!', 10);
  const teacherPassword = await bcrypt.hash('Teacher123!', 10);
  const studentPassword = await bcrypt.hash('Student123!', 10);
  const parentPassword = await bcrypt.hash('Parent123!', 10);

  // 1. Super Admin va School Admin
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

  // 2. Maktab
  const school = await prisma.school.upsert({
    where: { code: 'SCH-001' },
    update: {},
    create: {
      name: 'Toshkent Xalqaro Ta’lim Akademiyasi',
      code: 'SCH-001',
      address: 'Toshkent sh., Yunusobod tumani, Amir Temur shox ko‘chasi, 45-uy',
      phone: '+998712001122',
      email: 'info@ti-academy.uz',
    },
  });

  // 3. O'qituvchilar (8 nafar)
  const teachersData = [
    { email: 'teacher@ems.local', firstName: 'Bobur', lastName: 'Mirzayev', phone: '+998903456789' },
    { email: 'dilshod.qodirov@ems.local', firstName: 'Dilshod', lastName: 'Qodirov', phone: '+998903456790' },
    { email: 'nilufar.rahimova@ems.local', firstName: 'Nilufar', lastName: 'Rahimova', phone: '+998903456791' },
    { email: 'jamshid.aliyev@ems.local', firstName: 'Jamshid', lastName: 'Aliyev', phone: '+998903456792' },
    { email: 'gulnoza.karimova@ems.local', firstName: 'Gulnoza', lastName: 'Karimova', phone: '+998903456793' },
    { email: 'sherzod.usmonov@ems.local', firstName: 'Sherzod', lastName: 'Usmonov', phone: '+998903456794' },
    { email: 'nodira.xoliqova@ems.local', firstName: 'Nodira', lastName: 'Xoliqova', phone: '+998903456795' },
    { email: 'azizbek.tursunov@ems.local', firstName: 'Azizbek', lastName: 'Tursunov', phone: '+998903456796' },
  ];

  const teachers = [];
  for (const t of teachersData) {
    const user = await prisma.user.upsert({
      where: { email: t.email },
      update: { isActive: true },
      create: {
        email: t.email,
        passwordHash: teacherPassword,
        firstName: t.firstName,
        lastName: t.lastName,
        role: Role.TEACHER,
        phone: t.phone,
        isActive: true,
      },
    });
    teachers.push(user);
  }

  // 4. Guruhlar / Sinflar (ClassRoom)
  const classroomsData = [
    { name: '9-A Guruhi', gradeLevel: 9, academicYear: '2026-2027', schoolId: school.id },
    { name: '9-B Guruhi', gradeLevel: 9, academicYear: '2026-2027', schoolId: school.id },
    { name: '10-A Guruhi', gradeLevel: 10, academicYear: '2026-2027', schoolId: school.id },
    { name: '10-B Guruhi', gradeLevel: 10, academicYear: '2026-2027', schoolId: school.id },
    { name: '11-A Guruhi', gradeLevel: 11, academicYear: '2026-2027', schoolId: school.id },
    { name: 'Frontend Dev Pro', gradeLevel: 12, academicYear: '2026-2027', schoolId: school.id },
    { name: 'Robototexnika & STEM', gradeLevel: 8, academicYear: '2026-2027', schoolId: school.id },
  ];

  const classrooms = [];
  for (const cr of classroomsData) {
    let classroom = await prisma.classRoom.findFirst({ where: { name: cr.name } });
    if (!classroom) {
      classroom = await prisma.classRoom.create({ data: cr });
    }
    classrooms.push(classroom);
  }

  // 5. Fanlar va Kurslar (Course)
  const coursesData = [
    { code: 'MATH-101', title: 'Oliy Matematika & Algebra', credits: 4, teacherId: teachers[1].id },
    { code: 'PHYS-201', title: 'Fizika & Termodinamika', credits: 3, teacherId: teachers[5].id },
    { code: 'CS-301', title: 'Web Dasturlash (React & Node.js)', credits: 4, teacherId: teachers[0].id },
    { code: 'ENG-401', title: 'Akademik Ingliz Tili (IELTS)', credits: 3, teacherId: teachers[2].id },
    { code: 'SEC-501', title: 'Kiberxavfsizlik Asoslari', credits: 4, teacherId: teachers[3].id },
    { code: 'CHEM-601', title: 'Umumiy & Organik Kimyo', credits: 3, teacherId: teachers[4].id },
    { code: 'HIST-701', title: 'O‘zbekiston va Jahon Tarixi', credits: 2, teacherId: teachers[6].id },
    { code: 'ROBO-801', title: 'Robototexnika & Arduino', credits: 3, teacherId: teachers[7].id },
  ];

  const courses = [];
  for (const c of coursesData) {
    const course = await prisma.course.upsert({
      where: { code: c.code },
      update: { teacherId: c.teacherId },
      create: c,
    });
    courses.push(course);
  }

  // 6. O'quvchilar (26 nafar, turli oylarda ro'yxatdan o'tgan)
  const now = new Date();
  const studentsData = [
    { email: 'student@ems.local', firstName: 'Alisher', lastName: 'Sobirov', daysAgo: 120 },
    { email: 'madina.karimova@ems.local', firstName: 'Madina', lastName: 'Karimova', daysAgo: 95 },
    { email: 'javohir.toshmatov@ems.local', firstName: 'Javohir', lastName: 'Toshmatov', daysAgo: 80 },
    { email: 'fotima.ergasheva@ems.local', firstName: 'Fotima', lastName: 'Ergasheva', daysAgo: 65 },
    { email: 'zuhra.ergasheva@ems.local', firstName: 'Zuhra', lastName: 'Ergasheva', daysAgo: 65 },
    { email: 'sardor.olimov@ems.local', firstName: 'Sardor', lastName: 'Olimov', daysAgo: 45 },
    { email: 'jasur.bekmurodov@ems.local', firstName: 'Jasur', lastName: 'Bekmurodov', daysAgo: 40 },
    { email: 'nodirbek.qodirov@ems.local', firstName: 'Nodirbek', lastName: 'Qodirov', daysAgo: 38 },
    { email: 'kamola.yusupova@ems.local', firstName: 'Kamola', lastName: 'Yusupova', daysAgo: 30 },
    { email: 'shahzod.rustamov@ems.local', firstName: 'Shahzod', lastName: 'Rustamov', daysAgo: 28 },
    { email: 'dilorom.nazarova@ems.local', firstName: 'Dilorom', lastName: 'Nazarova', daysAgo: 25 },
    { email: 'bekzod.mahmudov@ems.local', firstName: 'Bekzod', lastName: 'Mahmudov', daysAgo: 22 },
    { email: 'munisa.rahimova@ems.local', firstName: 'Munisa', lastName: 'Rahimova', daysAgo: 20 },
    { email: 'oybek.hamidov@ems.local', firstName: 'Oybek', lastName: 'Hamidov', daysAgo: 18 },
    { email: 'shahlo.shokirova@ems.local', firstName: 'Shahlo', lastName: 'Shokirova', daysAgo: 15 },
    { email: 'temur.valiyev@ems.local', firstName: 'Temur', lastName: 'Valiyev', daysAgo: 14 },
    { email: 'zarina.samadova@ems.local', firstName: 'Zarina', lastName: 'Samadova', daysAgo: 12 },
    { email: 'farhod.azimov@ems.local', firstName: 'Farhod', lastName: 'Azimov', daysAgo: 10 },
    { email: 'dilnoza.akramova@ems.local', firstName: 'Dilnoza', lastName: 'Akramova', daysAgo: 8 },
    { email: 'bobur.shamsiyev@ems.local', firstName: 'Bobur', lastName: 'Shamsiyev', daysAgo: 7 },
    { email: 'umidjon.toirov@ems.local', firstName: 'Umidjon', lastName: 'Toirov', daysAgo: 5 },
    { email: 'malika.sultonova@ems.local', firstName: 'Malika', lastName: 'Sultonova', daysAgo: 4 },
    { email: 'doniyor.xalilov@ems.local', firstName: 'Doniyor', lastName: 'Xalilov', daysAgo: 3 },
    { email: 'shoxrux.mirzayev@ems.local', firstName: 'Shoxrux', lastName: 'Mirzayev', daysAgo: 2 },
    { email: 'nilufar.xasanova@ems.local', firstName: 'Nilufar', lastName: 'Xasanova', daysAgo: 1 },
    { email: 'azizbek.yuldashev@ems.local', firstName: 'Azizbek', lastName: 'Yuldashev', daysAgo: 0 },
  ];

  const students = [];
  for (let i = 0; i < studentsData.length; i++) {
    const s = studentsData[i];
    const regDate = new Date(now.getTime() - s.daysAgo * 24 * 60 * 60 * 1000);
    const assignedClassroom = classrooms[i % classrooms.length];
    const studentCode = `STU-2026-${String(1001 + i)}`;
    const birthDate = new Date(2008, i % 12, (i % 27) + 1);
    const address = `Toshkent shahri, ${i % 3 === 0 ? 'Yunusobod' : i % 3 === 1 ? 'Chilonzor' : 'Mirzo Ulug‘bek'} tumani, ${10 + i}-uy`;
    const avatarUrls = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150',
    ];
    const avatarUrl = avatarUrls[i % avatarUrls.length];

    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {
        createdAt: regDate,
        isActive: true,
        studentCode,
        classRoomId: assignedClassroom.id,
        address,
        birthDate,
        avatarUrl,
      },
      create: {
        email: s.email,
        passwordHash: studentPassword,
        firstName: s.firstName,
        lastName: s.lastName,
        role: Role.STUDENT,
        phone: `+99890500${1000 + i}`,
        isActive: true,
        studentCode,
        classRoomId: assignedClassroom.id,
        address,
        birthDate,
        avatarUrl,
        createdAt: regDate,
      },
    });
    students.push(user);
  }

  // 7. Enrollmentlar
  for (const s of students) {
    for (let cIdx = 0; cIdx < courses.length; cIdx += 2) {
      const course = courses[cIdx];
      await prisma.enrollment.upsert({
        where: {
          studentId_courseId: {
            studentId: s.id,
            courseId: course.id,
          },
        },
        update: {},
        create: {
          studentId: s.id,
          courseId: course.id,
          status: 'ACTIVE',
        },
      });
    }
  }

  // 8. Bugungi va Oxirgi 14 kunlik Davomat (Attendance)
  console.log('📝 Davomat yozuvlari generatsiya qilinmoqda...');
  await prisma.attendance.deleteMany({});
  for (let dayOffset = 13; dayOffset >= 0; dayOffset--) {
    const attDate = new Date(now);
    attDate.setDate(attDate.getDate() - dayOffset);
    attDate.setHours(9, 0, 0, 0);

    for (let sIdx = 0; sIdx < students.length; sIdx++) {
      const student = students[sIdx];
      const course = courses[sIdx % courses.length];

      let status: AttendanceStatus = AttendanceStatus.PRESENT;
      if (dayOffset === 0) {
        // Bugungi davomat: 88-92% kelgan
        if (sIdx === 3 || sIdx === 7) status = AttendanceStatus.ABSENT;
        else if (sIdx === 5) status = AttendanceStatus.LATE;
        else if (sIdx === 11) status = AttendanceStatus.EXCUSED;
        else status = AttendanceStatus.PRESENT;
      } else {
        const rand = (sIdx + dayOffset) % 10;
        if (rand === 0) status = AttendanceStatus.ABSENT;
        else if (rand === 1) status = AttendanceStatus.LATE;
        else if (rand === 2) status = AttendanceStatus.EXCUSED;
        else status = AttendanceStatus.PRESENT;
      }

      await prisma.attendance.create({
        data: {
          studentId: student.id,
          courseId: course.id,
          date: attDate,
          status,
          remarks: status === AttendanceStatus.ABSENT ? 'Sababsiz dars qoldirdi' : undefined,
        },
      });
    }
  }

  // 9. Test va Imtihon Natijalari (Grade)
  console.log('📊 Test va imtihon baholari saqlanmoqda...');
  await prisma.grade.deleteMany({});
  const gradeScores = [95, 88, 92, 78, 85, 90, 72, 94, 82, 89, 76, 98, 65, 84, 91, 79, 87, 93, 86, 74, 96, 83];
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    for (let c = 0; c < 3; c++) {
      const course = courses[(i + c) % courses.length];
      const score = gradeScores[(i * 3 + c) % gradeScores.length];
      await prisma.grade.create({
        data: {
          studentId: student.id,
          courseId: course.id,
          score,
          maxScore: 100,
          type: c === 0 ? GradeType.EXAM : c === 1 ? GradeType.QUIZ : GradeType.HOMEWORK,
          feedback: score >= 90 ? 'A’lo natija, materialni to‘liq o‘zlashtirgan' : score >= 80 ? 'Yaxshi, amaliy mashg‘ulotlarni mustahkamlash lozim' : 'Qoniqarli, qo‘shimcha konsultatsiya tavsiya etiladi',
        },
      });
    }
  }

  // 10. To'lovlar (Payment) - Oylik tushum va Qarzdorlik
  console.log('💳 To‘lovlar va qarzdorliklar kiritilmoqda...');
  await prisma.payment.deleteMany({});
  
  // O'tgan 6 oy va shu oy bo'yicha to'lovlar
  const monthlyAmounts = [
    { monthOffset: 5, base: 28000000 },
    { monthOffset: 4, base: 34500000 },
    { monthOffset: 3, base: 41000000 },
    { monthOffset: 2, base: 46200000 },
    { monthOffset: 1, base: 51800000 },
    { monthOffset: 0, base: 58400000 }, // Shu oy
  ];

  let invoiceCounter = 1001;

  for (const m of monthlyAmounts) {
    const paymentDate = new Date(now);
    paymentDate.setMonth(paymentDate.getMonth() - m.monthOffset);
    paymentDate.setDate(15);

    // Har bir oy uchun talabalar to'lovlari
    for (let i = 0; i < Math.min(students.length, 18); i++) {
      const student = students[i];
      const amount = 1500000 + (i % 4) * 300000; // 1.5M - 2.4M UZS
      const methods: PaymentMethod[] = [
        PaymentMethod.CLICK,
        PaymentMethod.PAYME,
        PaymentMethod.UZUM,
        PaymentMethod.CASH,
        PaymentMethod.BANK_TRANSFER,
      ];
      const method = methods[i % methods.length];

      await prisma.payment.create({
        data: {
          studentId: student.id,
          amount,
          paidAmount: amount,
          status: PaymentStatus.PAID,
          type: 'TUITION',
          paymentMethod: method,
          invoiceNumber: `INV-${paymentDate.getFullYear()}${paymentDate.getMonth() + 1}-${invoiceCounter++}`,
          dueDate: new Date(paymentDate.getTime() - 5 * 24 * 60 * 60 * 1000),
          paidAt: paymentDate,
          description: `${paymentDate.toLocaleString('uz-UZ', { month: 'long' })} oyi o‘quv to‘lovi`,
          createdAt: paymentDate,
        },
      });
    }
  }

  // Shu oy uchun qarzdorliklar (PENDING va OVERDUE)
  const debtStudents = students.slice(18, 26);
  for (let i = 0; i < debtStudents.length; i++) {
    const student = debtStudents[i];
    const amount = 1800000 + (i % 3) * 400000;
    const isOverdue = i % 2 === 0;
    const dueDate = new Date(now);
    dueDate.setDate(now.getDate() - (isOverdue ? 8 : -5));

    await prisma.payment.create({
      data: {
        studentId: student.id,
        amount,
        paidAmount: 0,
        status: isOverdue ? PaymentStatus.OVERDUE : PaymentStatus.PENDING,
        type: 'TUITION',
        invoiceNumber: `INV-${now.getFullYear()}${now.getMonth() + 1}-${invoiceCounter++}`,
        dueDate,
        description: 'Joriy oy uchun o‘quv shartnoma to‘lovi',
        createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // 11. Bugungi Darslar Jadvali (Schedule)
  console.log('📅 Dars jadvallari (Schedule) yaratilmoqda...');
  await prisma.schedule.deleteMany({});
  const currentDayOfWeek = now.getDay() === 0 ? 7 : now.getDay(); // 1=Dush ... 7=Yaksh

  const scheduleTemplates = [
    {
      courseCode: 'CS-301',
      teacherEmail: 'teacher@ems.local',
      classRoomName: 'Frontend Dev Pro',
      startTime: '09:00',
      endTime: '10:30',
      roomNumber: '304-Auditoriya',
      dayOfWeek: currentDayOfWeek,
    },
    {
      courseCode: 'MATH-101',
      teacherEmail: 'dilshod.qodirov@ems.local',
      classRoomName: '9-A Guruhi',
      startTime: '10:45',
      endTime: '12:15',
      roomNumber: '201-Auditoriya',
      dayOfWeek: currentDayOfWeek,
    },
    {
      courseCode: 'SEC-501',
      teacherEmail: 'jamshid.aliyev@ems.local',
      classRoomName: '10-A Guruhi',
      startTime: '13:30',
      endTime: '15:00',
      roomNumber: 'IT-Lab 1',
      dayOfWeek: currentDayOfWeek,
    },
    {
      courseCode: 'ENG-401',
      teacherEmail: 'nilufar.rahimova@ems.local',
      classRoomName: '11-A Guruhi',
      startTime: '15:15',
      endTime: '16:45',
      roomNumber: '105-Auditoriya',
      dayOfWeek: currentDayOfWeek,
    },
    {
      courseCode: 'ROBO-801',
      teacherEmail: 'azizbek.tursunov@ems.local',
      classRoomName: 'Robototexnika & STEM',
      startTime: '17:00',
      endTime: '18:30',
      roomNumber: 'STEM-Lab',
      dayOfWeek: currentDayOfWeek,
    },
    // Boshqa kunlar uchun namunalar
    {
      courseCode: 'PHYS-201',
      teacherEmail: 'sherzod.usmonov@ems.local',
      classRoomName: '9-B Guruhi',
      startTime: '09:00',
      endTime: '10:30',
      roomNumber: 'Fizika-Lab',
      dayOfWeek: (currentDayOfWeek % 7) + 1,
    },
    {
      courseCode: 'CHEM-601',
      teacherEmail: 'gulnoza.karimova@ems.local',
      classRoomName: '10-B Guruhi',
      startTime: '11:00',
      endTime: '12:30',
      roomNumber: 'Kimyo-Lab',
      dayOfWeek: (currentDayOfWeek % 7) + 1,
    },
  ];

  for (const item of scheduleTemplates) {
    const course = courses.find((c) => c.code === item.courseCode);
    const teacher = teachers.find((t) => t.email === item.teacherEmail);
    const classroom = classrooms.find((cr) => cr.name === item.classRoomName);

    if (course && teacher && classroom) {
      await prisma.schedule.create({
        data: {
          courseId: course.id,
          teacherId: teacher.id,
          classRoomId: classroom.id,
          dayOfWeek: item.dayOfWeek,
          startTime: item.startTime,
          endTime: item.endTime,
          roomNumber: item.roomNumber,
          isActive: true,
        },
      });
    }
  }

  // 12. Muhim Bildirishnomalar (Notification)
  console.log('🔔 Muhim bildirishnomalar saqlanmoqda...');
  await prisma.notification.deleteMany({});
  const notificationsData = [
    {
      title: 'Kuzgi semestr oraliq nazorati',
      message: 'Matematika va Dasturlash fanlaridan oraliq imtihonlar 20-noyabrdan boshlanadi. Jadval bilan tanishing.',
      type: 'URGENT',
      link: '/schedule',
      isRead: false,
      targetRole: Role.ADMIN,
    },
    {
      title: 'To‘lov qarzdorligi ogohlantirishi',
      message: 'Muddati o‘tgan 8 nafar o‘quvchilar ota-onalariga avtomatik SMS eslatma yuborildi.',
      type: 'WARNING',
      link: '/payments',
      isRead: false,
      targetRole: Role.ADMIN,
    },
    {
      title: 'Pedagogik kengash yig‘ilishi',
      message: 'Payshanba kuni soat 15:00 da o‘qituvchilarning oylik attestatsiya natijalari muhokamasi bo‘ladi.',
      type: 'INFO',
      link: '/courses',
      isRead: false,
      targetRole: Role.ADMIN,
    },
    {
      title: 'Xalqaro Fan Olimpiadasi g‘oliblari',
      message: 'Akademiyamizning 3 nafar o‘quvchisi shahar bosqichida 1-o‘rinni egalladi!',
      type: 'SUCCESS',
      link: '/analytics',
      isRead: true,
      targetRole: Role.ADMIN,
    },
  ];

  for (const n of notificationsData) {
    await prisma.notification.create({
      data: n,
    });
  }

  // 13. AuditLog - Oxirgi faoliyatlar
  console.log('📜 Oxirgi tizim faoliyatlari (Audit Log) yozilmoqda...');
  await prisma.auditLog.deleteMany({});
  const auditLogsData = [
    {
      action: 'PAYMENT_RECEIVED',
      resource: 'Payment',
      userEmail: 'admin@ems.local',
      details: 'Alisher Sobirov uchun 2,400,000 UZS qabul qilindi (Click)',
      createdAt: new Date(now.getTime() - 15 * 60 * 1000),
    },
    {
      action: 'STUDENT_REGISTERED',
      resource: 'User',
      userEmail: 'admin@ems.local',
      details: 'Yangi o‘quvchi ro‘yxatdan o‘tkazildi: Azizbek Yuldashev (9-A)',
      createdAt: new Date(now.getTime() - 45 * 60 * 1000),
    },
    {
      action: 'ATTENDANCE_RECORDED',
      resource: 'Attendance',
      userEmail: 'teacher@ems.local',
      details: 'Web Dasturlash darsi bo‘yicha bugungi davomat tasdiqlandi (22/24)',
      createdAt: new Date(now.getTime() - 110 * 60 * 1000),
    },
    {
      action: 'EXAM_GRADED',
      resource: 'Grade',
      userEmail: 'dilshod.qodirov@ems.local',
      details: 'Oliy Matematika fanidan test natijalari baholandi (O‘rtacha: 86 ball)',
      createdAt: new Date(now.getTime() - 210 * 60 * 1000),
    },
    {
      action: 'SCHEDULE_UPDATED',
      resource: 'Schedule',
      userEmail: 'admin@ems.local',
      details: 'Robototexnika darsi STEM-Lab xonasiga ko‘chirildi',
      createdAt: new Date(now.getTime() - 360 * 60 * 1000),
    },
    {
      action: 'PAYMENT_RECEIVED',
      resource: 'Payment',
      userEmail: 'admin@ems.local',
      details: 'Madina Karimova uchun 1,800,000 UZS qabul qilindi (Payme)',
      createdAt: new Date(now.getTime() - 540 * 60 * 1000),
    },
  ];

  for (const log of auditLogsData) {
    await prisma.auditLog.create({
      data: {
        action: log.action,
        resource: log.resource,
        userEmail: log.userEmail,
        details: log.details,
        createdAt: log.createdAt,
      },
    });
  }

  console.log('\n🎉 Real ma’lumotlar bazaga muvaffaqiyatli saqlandi!');
  console.log('----------------------------------------------------');
  console.log(`👨‍🎓 O‘quvchilar soni     : ${students.length}`);
  console.log(`👨‍🏫 O‘qituvchilar soni   : ${teachers.length}`);
  console.log(`🏢 Guruhlar (ClassRooms): ${classrooms.length}`);
  console.log(`📚 Kurslar soni         : ${courses.length}`);
  console.log(`📝 Davomat yozuvlari    : ${students.length * 14}`);
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
