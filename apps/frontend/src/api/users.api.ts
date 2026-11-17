import { apiClient } from './client';
import {
  ApiResponse,
  ICreateUserDto,
  IUpdateUserDto,
  IUserFilterQuery,
  PaginatedResult,
  UserSummary,
  UpdateUserStatusInput,
} from '@ems/shared';

export const usersApi = {
  getUsers: async (params?: IUserFilterQuery): Promise<PaginatedResult<UserSummary>> => {
    const res = await apiClient.get<ApiResponse<UserSummary[]>>('/users', { params });
    return {
      items: res.data.data || [],
      total: res.data.meta?.total || 0,
      page: res.data.meta?.page || 1,
      pageSize: res.data.meta?.pageSize || 10,
      totalPages: res.data.meta?.totalPages || 1,
    };
  },

  getUserById: async (id: string): Promise<UserSummary> => {
    const res = await apiClient.get<ApiResponse<UserSummary>>(`/users/${id}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Foydalanuvchi topilmadi');
    }
    return res.data.data;
  },

  createUser: async (data: ICreateUserDto): Promise<UserSummary> => {
    const res = await apiClient.post<ApiResponse<UserSummary>>('/users', data);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Foydalanuvchi yaratilmadi');
    }
    return res.data.data;
  },

  updateUser: async (id: string, data: IUpdateUserDto): Promise<UserSummary> => {
    const res = await apiClient.put<ApiResponse<UserSummary>>(`/users/${id}`, data);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Foydalanuvchini yangilab bo‘lmadi');
    }
    return res.data.data;
  },

  updateStatus: async (id: string, data: UpdateUserStatusInput): Promise<UserSummary> => {
    const res = await apiClient.patch<ApiResponse<UserSummary>>(`/users/${id}/status`, data);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Foydalanuvchi holatini o‘zgartirib bo‘lmadi');
    }
    return res.data.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
