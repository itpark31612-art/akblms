import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import { Application } from 'express';

describe('Admin Dashboard API Integration Tests (PostgreSQL)', () => {
  let app: Application;
  let adminToken: string;

  beforeAll(async () => {
    app = createApp();

    // Admin sifatida login qilish
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

  it('GET /api/v1/analytics/admin-dashboard - 8 ta statistika va 5 ta grafikni to‘liq qaytarishi kerak', async () => {
    const res = await request(app)
      .get('/api/v1/analytics/admin-dashboard?period=month')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const data = res.body.data;

    // 1. STATISTIKA:
    expect(data.stats.totalStudents).toBeGreaterThan(0);
    expect(data.stats.activeTeachers).toBeGreaterThan(0);
    expect(data.stats.totalGroups).toBeGreaterThan(0);
    expect(data.stats.todayAttendance).toBeDefined();
    expect(data.stats.todayAttendance.rate).toBeGreaterThan(0);
    expect(data.stats.monthlyRevenue).toBeDefined();
    expect(data.stats.monthlyRevenue.amount).toBeGreaterThan(0);
    expect(data.stats.totalDebt).toBeDefined();
    expect(data.stats.testResults).toBeDefined();
    expect(data.stats.testResults.averageScore).toBeGreaterThan(0);
    expect(data.stats.newRegistrations).toBeDefined();

    // 2. GRAFIKLAR:
    expect(data.charts.monthlyRevenue.length).toBeGreaterThan(0);
    expect(data.charts.studentGrowth.length).toBeGreaterThan(0);
    expect(data.charts.attendanceDynamics.length).toBeGreaterThan(0);
    expect(data.charts.subjectPerformance.length).toBeGreaterThan(0);
    expect(data.charts.paymentStats.statusBreakdown.length).toBeGreaterThan(0);
    expect(data.charts.paymentStats.methodBreakdown.length).toBeGreaterThan(0);

    // 3. QO‘SHIMCHA:
    expect(data.additional.recentActivities.length).toBeGreaterThan(0);
    expect(data.additional.todayLessons.length).toBeGreaterThan(0);
    expect(data.additional.notifications.length).toBeGreaterThan(0);
  });

  it('POST /api/v1/analytics/quick-student - Tezkor yangi o‘quvchi qo‘shishi kerak', async () => {
    const res = await request(app)
      .post('/api/v1/analytics/quick-student')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        firstName: 'Diyorbek',
        lastName: 'Muxtorov',
        email: `diyorbek.${Date.now()}@ems.local`,
        phone: '+998901112233',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.firstName).toBe('Diyorbek');
  });

  it('POST /api/v1/analytics/quick-payment - Tezkor to‘lov qabul qilishi kerak', async () => {
    const getRes = await request(app)
      .get('/api/v1/users?role=STUDENT')
      .set('Authorization', `Bearer ${adminToken}`);

    const student = getRes.body.data[0];

    const res = await request(app)
      .post('/api/v1/analytics/quick-payment')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        studentId: student.id,
        amount: 2500000,
        paymentMethod: 'CLICK',
        description: 'Tezkor to‘lov testi',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.amount).toBe(2500000);
  });
});
