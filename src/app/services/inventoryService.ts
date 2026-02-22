import { api } from '@/app/utils/apiClient';
import type {
  ApiResponse,
  PaginatedResponse,
  Ingredient,
  Product,
  CreateIngredientDto,
  UpdateInventoryDto,
} from '@/app/utils/apiTypes';

export const inventoryApi = {
  // Ingredients
  getIngredients: async (params?: { page?: number; pageSize?: number; status?: string; location?: string }): Promise<PaginatedResponse<Ingredient>> => {
    const response = await api.get<PaginatedResponse<Ingredient>>('/inventory/ingredients', { params });
    return response.data;
  },

  getIngredientById: async (id: string): Promise<ApiResponse<Ingredient>> => {
    const response = await api.get<ApiResponse<Ingredient>>(`/inventory/ingredients/${id}`);
    return response.data;
  },

  createIngredient: async (data: CreateIngredientDto): Promise<ApiResponse<Ingredient>> => {
    const response = await api.post<ApiResponse<Ingredient>>('/inventory/ingredients', data);
    return response.data;
  },

  updateIngredient: async (id: string, data: UpdateInventoryDto): Promise<ApiResponse<Ingredient>> => {
    const response = await api.patch<ApiResponse<Ingredient>>(`/inventory/ingredients/${id}`, data);
    return response.data;
  },

  deleteIngredient: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/inventory/ingredients/${id}`);
    return response.data;
  },

  // Products
  getProducts: async (params?: { page?: number; pageSize?: number; status?: string; location?: string }): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/inventory/products', { params });
    return response.data;
  },

  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await api.get<ApiResponse<Product>>(`/inventory/products/${id}`);
    return response.data;
  },

  updateProductStock: async (id: string, quantity: number): Promise<ApiResponse<Product>> => {
    const response = await api.patch<ApiResponse<Product>>(`/inventory/products/${id}/stock`, { quantity });
    return response.data;
  },

  // Low Stock Alerts
  getLowStockItems: async (): Promise<ApiResponse<(Ingredient | Product)[]>> => {
    const response = await api.get<ApiResponse<(Ingredient | Product)[]>>('/inventory/low-stock');
    return response.data;
  },

  // Inventory Locations
  getLocations: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get<ApiResponse<string[]>>('/inventory/locations');
    return response.data;
  },

  // Stock Transfer
  transferStock: async (data: { itemId: string; fromLocation: string; toLocation: string; quantity: number }): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>('/inventory/transfer', data);
    return response.data;
  },
};
