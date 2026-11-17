import { apiClient } from './client';
import {
  ApiResponse,
  ICreateUserDto,
  IUserFilterQuery,
  PaginatedResult,
  UserSummary,
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

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
