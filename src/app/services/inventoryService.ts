import { api } from '@/app/utils/apiClient';
import type { ApiResult } from '@/app/utils/apiTypes';

// ── Types khớp với backend IngredientDto ─────────────────────────────────────

export interface IngredientDto {
  ingredientId: number;
  ingredientName: string;
  unit?: string;
  storageCondition?: string;
  minStock?: number;
  price?: number;
}

export interface CreateIngredientModel {
  ingredientName: string;
  unit?: string;
  storageCondition?: string;
  minStock?: number;
  price?: number;
}

export interface UpdateIngredientModel {
  ingredientName: string;
  unit?: string;
  storageCondition?: string;
  minStock?: number;
  price?: number;
}

// ── Types khớp với backend InventoryLocationDto ───────────────────────────────

export interface InventoryLocationDto {
  inventoryLocationId: number;
  centralKitchenId: number;
  kitchenName?: string;
  name: string;
  locationType?: string;
  status?: string;
  updatedAt?: string;
}

export interface CreateInventoryLocationModel {
  centralKitchenId: number;
  name: string;
  locationType?: string;
}

export interface UpdateInventoryLocationModel {
  name: string;
  locationType?: string;
  status?: string;
}

// ── Ingredients API: /api/ingredients ────────────────────────────────────────

export const ingredientsApi = {
  getAll: async (): Promise<IngredientDto[]> => {
    const res = await api.get<ApiResult<IngredientDto[]>>('/ingredients');
    return res.data.data ?? [];
  },

  getById: async (id: number): Promise<IngredientDto> => {
    const res = await api.get<ApiResult<IngredientDto>>(`/ingredients/${id}`);
    return res.data.data!;
  },

  create: async (data: CreateIngredientModel): Promise<{ data: IngredientDto; message: string }> => {
    const res = await api.post<ApiResult<IngredientDto>>('/ingredients', data);
    return { data: res.data.data!, message: res.data.message ?? 'Tạo nguyên liệu thành công' };
  },

  update: async (id: number, data: UpdateIngredientModel): Promise<{ data: IngredientDto; message: string }> => {
    const res = await api.put<ApiResult<IngredientDto>>(`/ingredients/${id}`, data);
    return { data: res.data.data!, message: res.data.message ?? 'Cập nhật thành công' };
  },

  delete: async (id: number): Promise<string> => {
    const res = await api.delete<ApiResult<boolean>>(`/ingredients/${id}`);
    return res.data.message ?? 'Xóa nguyên liệu thành công';
  },
};

// ── Inventory Locations API: /api/inventory-locations ────────────────────────

export const inventoryLocationsApi = {
  getAll: async (): Promise<InventoryLocationDto[]> => {
    const res = await api.get<ApiResult<InventoryLocationDto[]>>('/inventory-locations');
    return res.data.data ?? [];
  },

  getByKitchen: async (kitchenId: number): Promise<InventoryLocationDto[]> => {
    const res = await api.get<ApiResult<InventoryLocationDto[]>>(`/inventory-locations/by-kitchen/${kitchenId}`);
    return res.data.data ?? [];
  },

  create: async (data: CreateInventoryLocationModel): Promise<InventoryLocationDto> => {
    const res = await api.post<ApiResult<InventoryLocationDto>>('/inventory-locations', data);
    return res.data.data!;
  },

  update: async (id: number, data: UpdateInventoryLocationModel): Promise<InventoryLocationDto> => {
    const res = await api.put<ApiResult<InventoryLocationDto>>(`/inventory-locations/${id}`, data);
    return res.data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete<ApiResult<boolean>>(`/inventory-locations/${id}`);
  },
};
