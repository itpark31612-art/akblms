import { apiClient } from './client';
import {
  ApiResponse,
  IStudentSummary,
  IStudentProfile,
  ICreateStudentInput,
  IUpdateStudentInput,
} from '@ems/shared';

export interface StudentFilterParams {
  search?: string;
  status?: string;
  classRoomId?: string;
  page?: number;
  pageSize?: number;
}

export interface StudentListResponse {
  items: IStudentSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ClassRoomItem {
  id: string;
  name: string;
  gradeLevel: number;
  academicYear: string;
  _count?: {
    students: number;
  };
}

export const studentsApi = {
  getStudents: async (params?: StudentFilterParams): Promise<StudentListResponse> => {
    const res = await apiClient.get<ApiResponse<StudentListResponse>>('/students', { params });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'O‘quvchilar ro‘yxatini olib bo‘lmadi');
    }
    return res.data.data;
  },

  getStudentProfile: async (id: string): Promise<IStudentProfile> => {
    const res = await apiClient.get<ApiResponse<IStudentProfile>>(`/students/${id}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'O‘quvchi profili topilmadi');
    }
    return res.data.data;
  },

  createStudent: async (data: ICreateStudentInput): Promise<any> => {
    const res = await apiClient.post<ApiResponse<any>>('/students', data);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'O‘quvchini qo‘shishda xatolik yuz berdi');
    }
    return res.data.data;
  },

  updateStudent: async (id: string, data: IUpdateStudentInput): Promise<any> => {
    const res = await apiClient.put<ApiResponse<any>>(`/students/${id}`, data);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'O‘quvchini yangilab bo‘lmadi');
    }
    return res.data.data;
  },

  archiveStudent: async (id: string, archive: boolean): Promise<any> => {
    const res = await apiClient.patch<ApiResponse<any>>(`/students/${id}/archive`, { archive });
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'O‘quvchi holatini o‘zgartirib bo‘lmadi');
    }
    return res.data.data;
  },

  deleteStudent: async (id: string): Promise<any> => {
    const res = await apiClient.delete<ApiResponse<any>>(`/students/${id}`);
    return res.data.data;
  },

  getClassRooms: async (): Promise<ClassRoomItem[]> => {
    const res = await apiClient.get<ApiResponse<ClassRoomItem[]>>('/students/classrooms');
    return res.data.data || [];
  },
};
