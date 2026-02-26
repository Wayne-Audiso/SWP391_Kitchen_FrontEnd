import { api } from '@/app/utils/apiClient';

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

export const usersApi = {
  getAll: async (): Promise<UserApiModel[]> => {
    const response = await api.get<UserApiModel[]>('/users');
    return response.data;
  },

  getById: async (id: string): Promise<UserApiModel> => {
    const response = await api.get<UserApiModel>(`/users/${id}`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  update: async (id: string, data: UpdateUserModel): Promise<void> => {
    await api.put(`/users/${id}`, data);
  },
};
