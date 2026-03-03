import { api } from "@/app/utils/apiClient";
import type { ApiResult } from "@/app/utils/apiTypes";

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
  role?: string;
}

// Auth API
export const authApi = {
  /**
   * POST /api/auth/login
   * Backend trả ApiResult<LoginResponseModel> — service unwrap về LoginApiResponse.
   */
  login: async (credentials: {
    username: string;
    password: string;
  }): Promise<LoginApiResponse> => {
    const response = await api.post<ApiResult<LoginApiResponse>>(
      "/auth/login",
      credentials,
    );
    return response.data.data!;
  },

  /**
   * POST /api/auth/register
   * Backend trả ApiResult<CreateUserResponseModel> — chỉ cần biết thành công/thất bại.
   */
  register: async (data: RegisterRequest): Promise<void> => {
    await api.post<ApiResult<unknown>>("/auth/register", data);
  },
};
