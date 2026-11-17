import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { Application } from 'express';

describe('Student Management API Integration Tests (PostgreSQL)', () => {
  let app: Application;
  let adminToken: string;
  let createdStudentId: string;

  beforeAll(async () => {
    app = createApp();

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@ems.local',
        password: 'Admin123!',
      });

    expect(loginRes.status).toBe(200);
    adminToken = loginRes.body.data.tokens.accessToken;
    expect(adminToken).toBeDefined();
  });

  it('GET /api/v1/students/classrooms - Guruhlar ro‘yxatini qaytarishi kerak', async () => {
    const res = await request(app)
      .get('/api/v1/students/classrooms')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/students - O‘quvchilar ro‘yxatini filtrlash bilan qaytarishi kerak', async () => {
    const res = await request(app)
      .get('/api/v1/students?page=1&pageSize=10')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items).toBeDefined();
    expect(res.body.data.items.length).toBeGreaterThan(0);

    const student = res.body.data.items[0];
    expect(student.studentCode).toBeDefined();
    expect(student.gpa).toBeDefined();
    expect(student.attendanceRate).toBeDefined();
  });

  it('POST /api/v1/students - Yangi o‘quvchi yaratishi va studentCode berishi kerak', async () => {
    const timestamp = Date.now();
    const res = await request(app)
      .post('/api/v1/students')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Farrux',
        lastName: 'Zokirov',
        email: `farrux.${timestamp}@ems.local`,
        phone: '+998901239988',
        address: 'Toshkent, Yunusobod 4-mavze',
        birthDate: '2008-05-15',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.studentCode).toContain('STU-');
    createdStudentId = res.body.data.id;
  });

  it('GET /api/v1/students/:id - O‘quvchining to‘liq profilini (tarixi bilan) qaytarishi kerak', async () => {
    const res = await request(app)
      .get(`/api/v1/students/${createdStudentId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const profile = res.body.data;

    expect(profile.student).toBeDefined();
    expect(profile.student.id).toBe(createdStudentId);
    expect(profile.enrollments).toBeDefined();
    expect(profile.attendances).toBeDefined();
    expect(profile.attendanceStats).toBeDefined();
    expect(profile.academicStats).toBeDefined();
    expect(profile.payments).toBeDefined();
    expect(profile.paymentStats).toBeDefined();
  });

  it('PUT /api/v1/students/:id - O‘quvchi ma’lumotlarini tahrirlashi kerak', async () => {
    const res = await request(app)
      .put(`/api/v1/students/${createdStudentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Farruxbek',
        phone: '+998907778899',
        address: 'Toshkent sh., Chilonzor 9-mavze',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.firstName).toBe('Farruxbek');
    expect(res.body.data.phone).toBe('+998907778899');
  });

  it('PATCH /api/v1/students/:id/archive - O‘quvchini arxivlashi va tiklashi kerak', async () => {
    // 1. Arxivlash
    const archiveRes = await request(app)
      .patch(`/api/v1/students/${createdStudentId}/archive`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ archive: true });

    expect(archiveRes.status).toBe(200);
    expect(archiveRes.body.data.status).toBe('ARCHIVED');
    expect(archiveRes.body.data.isActive).toBe(false);

    // 2. Tiklash
    const restoreRes = await request(app)
      .patch(`/api/v1/students/${createdStudentId}/archive`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ archive: false });

    expect(restoreRes.status).toBe(200);
    expect(restoreRes.body.data.status).toBe('ACTIVE');
    expect(restoreRes.body.data.isActive).toBe(true);
  });

  it('DELETE /api/v1/students/:id - O‘quvchini o‘chirishi kerak', async () => {
    const res = await request(app)
      .delete(`/api/v1/students/${createdStudentId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Qayta tekshirib ko'ramiz
    const checkRes = await request(app)
      .get(`/api/v1/students/${createdStudentId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(checkRes.status).toBe(404);
  });
});
