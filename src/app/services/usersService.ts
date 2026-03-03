import { api } from '@/app/utils/apiClient';
import type { ApiResult } from '@/app/utils/apiTypes';

// Khớp với BE UserResponseModel
export interface UserApiModel {
  id: string;
  userName: string;
  email: string;
  role: string;
}

export interface UpdateUserModel {
  userName: string;
  email: string;
}

// Backend bọc kết quả trong ApiResult<T> — service unwrap về T trực tiếp.
export const usersApi = {
  getAll: async (): Promise<UserApiModel[]> => {
    const res = await api.get<ApiResult<UserApiModel[]>>('/users');
    return res.data.data ?? [];
  },

  getById: async (id: string): Promise<UserApiModel> => {
    const res = await api.get<ApiResult<UserApiModel>>(`/users/${id}`);
    return res.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete<ApiResult<boolean>>(`/users/${id}`);
  },

  update: async (id: string, data: UpdateUserModel): Promise<void> => {
    await api.put<ApiResult<unknown>>(`/users/${id}`, data);
  },
};
