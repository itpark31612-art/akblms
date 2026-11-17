import { apiClient } from './client';
import { ApiResponse, IAdminDashboardResponse, PaymentMethodType } from '@ems/shared';

export interface DashboardAnalyticsData {
  role: string;
  stats: Record<string, unknown>;
  monthlyEnrollments?: Array<{ month: string; students: number; teachers: number }>;
  attendanceOverview?: Array<{ name: string; present: number; absent: number }>;
  recentLogs?: Array<{
    id: string;
    action: string;
    resource: string;
    userEmail?: string;
    createdAt: string;
  }>;
  gradeDistribution?: Array<{ grade: string; count: number }>;
  weeklySchedule?: Array<{ day: string; time: string; subject: string; room: string }>;
  performanceTrend?: Array<{ subject: string; score: number; maxScore: number }>;
  upcomingTasks?: Array<{ title: string; deadline: string; status: string }>;
  childrenOverview?: Array<{
    name: string;
    grade: string;
    attendanceRate: string;
    gpa: string;
    lastActivity: string;
  }>;
  paymentStatus?: {
    status: string;
    month: string;
    amount: string;
    dueDate: string;
  };
}

export interface QuickStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface QuickPaymentDto {
  studentId: string;
  amount: number;
  paymentMethod: PaymentMethodType;
  description?: string;
}

export const analyticsApi = {
  getDashboard: async (): Promise<DashboardAnalyticsData> => {
    const res = await apiClient.get<ApiResponse<DashboardAnalyticsData>>('/analytics/dashboard');
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Analitika ma’lumotlari topilmadi');
    }
    return res.data.data;
  },

  getAdminDashboard: async (params?: {
    period?: 'today' | 'week' | 'month' | 'year' | 'custom';
    startDate?: string;
    endDate?: string;
  }): Promise<IAdminDashboardResponse> => {
    const res = await apiClient.get<ApiResponse<IAdminDashboardResponse>>('/analytics/admin-dashboard', {
      params,
    });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Admin Dashboard ma’lumotlari topilmadi');
    }
    return res.data.data;
  },

  createQuickStudent: async (data: QuickStudentDto) => {
    const res = await apiClient.post<ApiResponse<any>>('/analytics/quick-student', data);
    return res.data.data;
  },

  recordQuickPayment: async (data: QuickPaymentDto) => {
    const res = await apiClient.post<ApiResponse<any>>('/analytics/quick-payment', data);
    return res.data.data;
  },

  markNotificationRead: async (id: string) => {
    const res = await apiClient.patch<ApiResponse<any>>(`/analytics/notifications/${id}/read`);
    return res.data.data;
  },
};
