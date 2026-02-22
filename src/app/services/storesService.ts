import { api } from '@/app/utils/apiClient';
import type {
  ApiResponse,
  PaginatedResponse,
  FranchiseStore,
  CreateStoreDto,
  UpdateStoreDto,
} from '@/app/utils/apiTypes';

export const storesApi = {
  getAll: async (params?: { page?: number; pageSize?: number; status?: string }): Promise<PaginatedResponse<FranchiseStore>> => {
    const response = await api.get<PaginatedResponse<FranchiseStore>>('/stores', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<FranchiseStore>> => {
    const response = await api.get<ApiResponse<FranchiseStore>>(`/stores/${id}`);
    return response.data;
  },

  create: async (data: CreateStoreDto): Promise<ApiResponse<FranchiseStore>> => {
    const response = await api.post<ApiResponse<FranchiseStore>>('/stores', data);
    return response.data;
  },

  update: async (id: string, data: UpdateStoreDto): Promise<ApiResponse<FranchiseStore>> => {
    const response = await api.patch<ApiResponse<FranchiseStore>>(`/stores/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/stores/${id}`);
    return response.data;
  },

  toggleStatus: async (id: string): Promise<ApiResponse<FranchiseStore>> => {
    const response = await api.patch<ApiResponse<FranchiseStore>>(`/stores/${id}/toggle-status`);
    return response.data;
  },

  // Store Statistics
  getStoreStats: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>(`/stores/${id}/stats`);
    return response.data;
  },

  // Store Orders
  getStoreOrders: async (id: string, params?: { page?: number; pageSize?: number }): Promise<PaginatedResponse<any>> => {
    const response = await api.get<PaginatedResponse<any>>(`/stores/${id}/orders`, { params });
    return response.data;
  },

  // Store Inventory
  getStoreInventory: async (id: string): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>(`/stores/${id}/inventory`);
    return response.data;
  },
};
