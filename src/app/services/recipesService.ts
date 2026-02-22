import { api } from '@/app/utils/apiClient';
import type {
  ApiResponse,
  PaginatedResponse,
  Recipe,
  CreateRecipeDto,
} from '@/app/utils/apiTypes';

export const recipesApi = {
  getAll: async (params?: { page?: number; pageSize?: number; category?: string }): Promise<PaginatedResponse<Recipe>> => {
    const response = await api.get<PaginatedResponse<Recipe>>('/recipes', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Recipe>> => {
    const response = await api.get<ApiResponse<Recipe>>(`/recipes/${id}`);
    return response.data;
  },

  create: async (data: CreateRecipeDto): Promise<ApiResponse<Recipe>> => {
    const response = await api.post<ApiResponse<Recipe>>('/recipes', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateRecipeDto>): Promise<ApiResponse<Recipe>> => {
    const response = await api.patch<ApiResponse<Recipe>>(`/recipes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/recipes/${id}`);
    return response.data;
  },

  // Categories
  getCategories: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get<ApiResponse<string[]>>('/recipes/categories');
    return response.data;
  },

  // Recipe Costing
  calculateCost: async (id: string): Promise<ApiResponse<{ totalCost: number; costPerServing: number }>> => {
    const response = await api.get<ApiResponse<{ totalCost: number; costPerServing: number }>>(`/recipes/${id}/cost`);
    return response.data;
  },
};
