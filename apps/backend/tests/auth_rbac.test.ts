import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { prisma } from '../src/db/prisma';
import { UserRole } from '@ems/shared';

describe('EMS Authentication & RBAC System (Integration with PostgreSQL)', () => {
  const app = createApp();

  let superAdminToken: string;
  let adminToken: string;
  let studentToken: string;
  let teacherToken: string;
  let testUserId: string;

  beforeAll(async () => {
    // 1. Super Admin login
    const saRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'superadmin@ems.local', password: 'Admin123!' });
    expect(saRes.status).toBe(200);
    superAdminToken = saRes.body.data.tokens.accessToken;

    // 2. Admin login
    const aRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@ems.local', password: 'Admin123!' });
    expect(aRes.status).toBe(200);
    adminToken = aRes.body.data.tokens.accessToken;

    // 3. Student login
    const sRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'student@ems.local', password: 'Student123!' });
    expect(sRes.status).toBe(200);
    studentToken = sRes.body.data.tokens.accessToken;

    // 4. Teacher login
    const tRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'teacher@ems.local', password: 'Teacher123!' });
    expect(tRes.status).toBe(200);
    teacherToken = tRes.body.data.tokens.accessToken;
  });

  describe('1. Login & Token Validation', () => {
    it('Muvaffaqiyatli kirishda JWT access va refresh tokenlarni qaytarishi kerak', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'admin@ems.local', password: 'Admin123!' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tokens).toHaveProperty('accessToken');
      expect(res.body.data.tokens).toHaveProperty('refreshToken');
      expect(res.body.data.user.email).toBe('admin@ems.local');
      expect(res.body.data.user.role).toBe(UserRole.ADMIN);
      expect(res.body.data.user.permissions).toBeInstanceOf(Array);
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('Noto‘g‘ri parol kiritilganda 401 Unauthorized qaytarishi kerak', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'admin@ems.local', password: 'WrongPassword999!' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.message).toContain('noto‘g‘ri');
    });

    it('Mavjud bo‘lmagan hisob uchun 401 qaytarishi kerak', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'nonexistent@ems.local', password: 'Password123!' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('2. Refresh Token Rotation & Reuse Detection', () => {
    it('Refresh token orqali yangi token juftligi olinishi va eski token bekor qilinishi kerak (Rotation)', async () => {
      // 1. Yangi login qilib refresh token olish
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'teacher@ems.local', password: 'Teacher123!' });

      const oldRefreshToken = loginRes.body.data.tokens.refreshToken;

      // 2. Tokenni yangilash
      const refreshRes = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: oldRefreshToken });

      expect(refreshRes.status).toBe(200);
      expect(refreshRes.body.data).toHaveProperty('accessToken');
      expect(refreshRes.body.data).toHaveProperty('refreshToken');

      const newRefreshToken = refreshRes.body.data.refreshToken;
      expect(newRefreshToken).not.toBe(oldRefreshToken);

      // 3. Eski bekor qilingan tokenni qayta ishlatishga urinish (Reuse Detection)
      const reuseRes = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: oldRefreshToken });

      expect(reuseRes.status).toBe(401);
      expect(reuseRes.body.error.message).toContain('bekor qilindi');
    });
  });

  describe('3. Password Reset Flow (Forgot & Reset Password)', () => {
    let resetToken: string;
    const testEmail = `reset-user-${Date.now()}@ems.local`;

    it('Yangi foydalanuvchi yaratish va parolni unutish so‘rovini yuborish', async () => {
      // Yangi user yaratamiz
      const regRes = await request(app).post('/api/v1/auth/register').send({
        email: testEmail,
        password: 'InitialPassword123!',
        firstName: 'Sardor',
        lastName: 'Aliyev',
        role: UserRole.STUDENT,
      });
      expect(regRes.status).toBe(201);

      // Parolni unutdim so'rovi
      const forgotRes = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: testEmail });

      expect(forgotRes.status).toBe(200);
      expect(forgotRes.body.data).toHaveProperty('resetToken');
      resetToken = forgotRes.body.data.resetToken;
      expect(resetToken).toBeDefined();
    });

    it('Tiklash tokeni orqali parolni yangilash va yangi parol bilan kirish', async () => {
      const resetRes = await request(app).post('/api/v1/auth/reset-password').send({
        token: resetToken,
        newPassword: 'BrandNewPassword123!',
      });

      expect(resetRes.status).toBe(200);

      // Eski parol bilan kirib bo'lmasligi kerak
      const oldLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testEmail, password: 'InitialPassword123!' });
      expect(oldLogin.status).toBe(401);

      // Yangi parol bilan kirish muvaffaqiyatli bo'lishi kerak
      const newLogin = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: testEmail, password: 'BrandNewPassword123!' });
      expect(newLogin.status).toBe(200);
      expect(newLogin.body.data.user.email).toBe(testEmail);
    });
  });

  describe('4. RBAC (Role-Based Access Control) & Permission Enforcement', () => {
    it('Avtorizatsiyasiz himoyalangan API ga so‘rov yuborilganda 401 Unauthorized qaytishi kerak', async () => {
      const res = await request(app).get('/api/v1/users');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('O‘quvchi (Student) yangi foydalanuvchi yaratishga uringanda 403 Forbidden qaytishi kerak', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          email: 'illegal-user@ems.local',
          password: 'Password123!',
          firstName: 'No',
          lastName: 'Access',
          role: UserRole.STUDENT,
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('FORBIDDEN');
      expect(res.body.error.message).toContain('ADMIN');
    });

    it('Admin yangi foydalanuvchi yaratishi va ro‘yxatda ko‘rishi mumkin (201 Created)', async () => {
      const newUserEmail = `created-by-admin-${Date.now()}@ems.local`;
      const res = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: newUserEmail,
          password: 'SafePassword123!',
          firstName: 'Shahlo',
          lastName: 'Yusupova',
          role: UserRole.TEACHER,
          phone: '+998901112233',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.email).toBe(newUserEmail);
      expect(res.body.data.role).toBe(UserRole.TEACHER);
      testUserId = res.body.data.id;
    });

    it('Super Admin barcha ruxsatlarga ega ekanligini tasdiqlash (Wildcard *)', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${superAdminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('5. Account Status Management (Active, Blocked & Lockout)', () => {
    it('Admin foydalanuvchini bloklashi (status: BLOCKED) va foydalanuvchi kirishi taqiqlanishi kerak', async () => {
      expect(testUserId).toBeDefined();

      // 1. Foydalanuvchini bloklash
      const blockRes = await request(app)
        .patch(`/api/v1/users/${testUserId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'BLOCKED', reason: 'Qoidalarni buzganligi sababli' });

      expect(blockRes.status).toBe(200);
      expect(blockRes.body.data.status).toBe('BLOCKED');
      expect(blockRes.body.data.isActive).toBe(false);

      // 2. Bloklangan foydalanuvchi login qilishga uringanda 403 Forbidden olishi kerak
      const user = await prisma.user.findUnique({ where: { id: testUserId } });
      const loginAttempt = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: user!.email, password: 'SafePassword123!' });

      expect(loginAttempt.status).toBe(403);
      expect(loginAttempt.body.error.message).toContain('bloklangan');

      // 3. Foydalanuvchini qayta faollashtirish
      const unblockRes = await request(app)
        .patch(`/api/v1/users/${testUserId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'ACTIVE', reason: 'Murojaat ijobiy hal qilindi' });

      expect(unblockRes.status).toBe(200);
      expect(unblockRes.body.data.status).toBe('ACTIVE');
      expect(unblockRes.body.data.isActive).toBe(true);

      // 4. Qayta faollashgach login muvaffaqiyatli bo'lishi kerak
      const loginAfterUnblock = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: user!.email, password: 'SafePassword123!' });

      expect(loginAfterUnblock.status).toBe(200);
      expect(loginAfterUnblock.body.data.user.status).toBe('ACTIVE');
    });
  });

  describe('6. Profile Management & Password Change', () => {
    it('GET /api/v1/auth/me o‘z profil ma’lumotlarini va ruxsatlarini to‘g‘ri qaytarishi kerak', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.role).toBe(UserRole.STUDENT);
      expect(res.body.data.permissions).toContain('grades:view_self');
    });

    it('PUT /api/v1/auth/profile foydalanuvchi ism va telefonini yangilashi kerak', async () => {
      const res = await request(app)
        .put('/api/v1/auth/profile')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          firstName: 'Alisher (Tahrirlangan)',
          phone: '+998991234567',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.firstName).toBe('Alisher (Tahrirlangan)');
      expect(res.body.data.phone).toBe('+998991234567');
    });
  });
});
