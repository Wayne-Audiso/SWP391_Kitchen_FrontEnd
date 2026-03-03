import { api } from '@/app/utils/apiClient';
import type { ApiResult } from '@/app/utils/apiTypes';

// ── Types khớp với backend DTOs ───────────────────────────────────────────────

export interface RecipeIngredientDto {
  recipeIngredientId: number;
  ingredientId: number;
  ingredientName: string;
  unit?: string;
  price?: number;
  quantity?: number;
  totalCost?: number;
}

export interface RecipeDto {
  recipeId: number;
  recipeName: string;
  description?: string;
  createdDate?: string;
  totalCost: number;
  ingredients: RecipeIngredientDto[];
}

export interface CreateRecipeIngredientModel {
  ingredientId: number;
  quantity?: number;
}

export interface CreateRecipeModel {
  recipeName: string;
  description?: string;
  ingredients: CreateRecipeIngredientModel[];
}

export interface UpdateRecipeModel {
  recipeName: string;
  description?: string;
  ingredients: CreateRecipeIngredientModel[];
}

// ── Recipes API: /api/recipes ─────────────────────────────────────────────────

export const recipesApi = {
  getAll: async (): Promise<RecipeDto[]> => {
    const res = await api.get<ApiResult<RecipeDto[]>>('/recipes');
    return res.data.data ?? [];
  },

  getById: async (id: number): Promise<RecipeDto> => {
    const res = await api.get<ApiResult<RecipeDto>>(`/recipes/${id}`);
    return res.data.data!;
  },

  create: async (data: CreateRecipeModel): Promise<{ data: RecipeDto; message: string }> => {
    const res = await api.post<ApiResult<RecipeDto>>('/recipes', data);
    return { data: res.data.data!, message: res.data.message ?? 'Tạo công thức thành công' };
  },

  update: async (id: number, data: UpdateRecipeModel): Promise<{ data: RecipeDto; message: string }> => {
    const res = await api.put<ApiResult<RecipeDto>>(`/recipes/${id}`, data);
    return { data: res.data.data!, message: res.data.message ?? 'Cập nhật công thức thành công' };
  },

  delete: async (id: number): Promise<string> => {
    const res = await api.delete<ApiResult<boolean>>(`/recipes/${id}`);
    return res.data.message ?? 'Xóa công thức thành công';
  },
};
