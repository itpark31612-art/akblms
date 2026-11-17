import { apiClient } from './client';
import {
  ApiResponse,
  LoginInput,
  LoginResponse,
  RegisterInput,
  UserSummary,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
  UpdateProfileInput,
} from '@ems/shared';

export const authApi = {
  login: async (credentials: LoginInput): Promise<LoginResponse> => {
    const res = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Kirishda xatolik');
    }
    return res.data.data;
  },

  register: async (data: RegisterInput): Promise<LoginResponse> => {
    const res = await apiClient.post<ApiResponse<LoginResponse>>('/auth/register', data);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Ro‘yxatdan o‘tishda xatolik');
    }
    return res.data.data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await apiClient.post('/auth/logout', { refreshToken });
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  getMe: async (): Promise<UserSummary> => {
    const res = await apiClient.get<ApiResponse<UserSummary>>('/auth/me');
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Profilni yuklashda xatolik');
    }
    return res.data.data;
  },

  forgotPassword: async (
    data: ForgotPasswordInput
  ): Promise<{ message: string; resetToken?: string }> => {
    const res = await apiClient.post<ApiResponse<{ message: string; resetToken?: string }>>(
      '/auth/forgot-password',
      data
    );
    return res.data.data || { message: res.data.message || 'Tiklash kodi yuborildi' };
  },

  resetPassword: async (data: ResetPasswordInput): Promise<void> => {
    const res = await apiClient.post<ApiResponse<null>>('/auth/reset-password', data);
    if (!res.data.success) {
      throw new Error(res.data.error?.message || 'Parolni tiklashda xatolik');
    }
  },

  changePassword: async (data: ChangePasswordInput): Promise<void> => {
    const res = await apiClient.put<ApiResponse<null>>('/auth/change-password', data);
    if (!res.data.success) {
      throw new Error(res.data.error?.message || 'Parolni o‘zgartirishda xatolik');
    }
  },

  updateProfile: async (data: UpdateProfileInput): Promise<UserSummary> => {
    const res = await apiClient.put<ApiResponse<UserSummary>>('/auth/profile', data);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Profilni yangilashda xatolik');
    }
    return res.data.data;
  },
};
