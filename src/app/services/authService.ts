import { api } from "@/app/utils/apiClient";
import type {
  ApiResponse,
  PaginatedResponse,
  User,
  CreateUserDto,
  UpdateUserDto,
} from "@/app/utils/apiTypes";

// Backend login response (khớp với LoginResponseModel)
export interface LoginApiResponse {
  userId: string;
  username: string;
  role: string;
  email: string;
  token: string;
}

// Register request (khớp với RegisterUserModel)
export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Auth API - gọi đúng endpoint của backend
export const authApi = {
  login: async (credentials: {
    username: string;
    password: string;
  }): Promise<LoginApiResponse> => {
    const response = await api.post<LoginApiResponse>(
      "/auth/login",
      credentials,
    );
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<any> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },
};

// Users API (dùng cho trang User Management)
export const usersApi = {
  getAll: async (params?: {
    page?: number;
    pageSize?: number;
    role?: string;
    status?: string;
  }): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>("/users", {
      params,
    });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUserDto): Promise<ApiResponse<User>> => {
    const response = await api.post<ApiResponse<User>>("/users", data);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateUserDto,
  ): Promise<ApiResponse<User>> => {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/users/${id}`);
    return response.data;
  },

  toggleStatus: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.patch<ApiResponse<User>>(
      `/users/${id}/toggle-status`,
    );
    return response.data;
  },
};
