import { apiClient } from './client';
import { ApiResponse, CreateCourseInput, ICourse } from '@ems/shared';

export const coursesApi = {
  getAll: async (): Promise<ICourse[]> => {
    const res = await apiClient.get<ApiResponse<ICourse[]>>('/courses');
    return res.data.data || [];
  },

  create: async (data: CreateCourseInput): Promise<ICourse> => {
    const res = await apiClient.post<ApiResponse<ICourse>>('/courses', data);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Kurs yaratilmadi');
    }
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/courses/${id}`);
  },
};
