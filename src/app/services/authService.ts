import { api } from './apiClient';
import type {
  ApiResponse,
  PaginatedResponse,
  LoginDto,
  LoginResponse,
  User,
  CreateUserDto,
  UpdateUserDto,
} from './apiTypes';

// Auth API
export const authApi = {
  login: async (credentials: LoginDto): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>('/auth/logout');
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    const response = await api.post<ApiResponse<{ token: string }>>('/auth/refresh');
    return response.data;
  },
};

// Users API
export const usersApi = {
  getAll: async (params?: { page?: number; pageSize?: number; role?: string; status?: string }): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>('/users', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUserDto): Promise<ApiResponse<User>> => {
    const response = await api.post<ApiResponse<User>>('/users', data);
    return response.data;
  },

  update: async (id: string, data: UpdateUserDto): Promise<ApiResponse<User>> => {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/users/${id}`);
    return response.data;
  },

  toggleStatus: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}/toggle-status`);
    return response.data;
  },
};

// Roles API
export const rolesApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>('/roles');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>(`/roles/${id}`);
    return response.data;
  },

  getPermissions: async (roleId: string): Promise<ApiResponse<string[]>> => {
    const response = await api.get<ApiResponse<string[]>>(`/roles/${roleId}/permissions`);
    return response.data;
  },
};
