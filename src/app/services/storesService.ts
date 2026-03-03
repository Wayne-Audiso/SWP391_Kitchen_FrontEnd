import { api } from '@/app/utils/apiClient';
import type { ApiResult } from '@/app/utils/apiTypes';

// --- Types khớp với backend models ---

export interface FranchiseStoreDto {
  storeId: number;
  kitchenId: number;
  kitchenName?: string;
  storeName: string;
  address?: string;
}

export interface CentralKitchenDto {
  centralKitchenId: number;
  name: string;
  address?: string;
  phone?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFranchiseStoreModel {
  kitchenId: number;
  storeName: string;
  address?: string;
}

export interface UpdateFranchiseStoreModel {
  kitchenId: number;
  storeName: string;
  address?: string;
}

export interface CreateCentralKitchenModel {
  name: string;
  address?: string;
  phone?: string;
}

export interface UpdateCentralKitchenModel {
  name: string;
  address?: string;
  phone?: string;
  status?: string;
}

// --- Franchise Stores API: /api/franchise-stores ---
// Backend bọc kết quả trong ApiResult<T> — service unwrap về T trực tiếp.

export const franchiseStoresApi = {
  getAll: async (): Promise<FranchiseStoreDto[]> => {
    const res = await api.get<ApiResult<FranchiseStoreDto[]>>('/franchise-stores');
    return res.data.data ?? [];
  },

  getById: async (id: number): Promise<FranchiseStoreDto> => {
    const res = await api.get<ApiResult<FranchiseStoreDto>>(`/franchise-stores/${id}`);
    return res.data.data!;
  },

  create: async (data: CreateFranchiseStoreModel): Promise<FranchiseStoreDto> => {
    const res = await api.post<ApiResult<FranchiseStoreDto>>('/franchise-stores', data);
    return res.data.data!;
  },

  update: async (id: number, data: UpdateFranchiseStoreModel): Promise<FranchiseStoreDto> => {
    const res = await api.put<ApiResult<FranchiseStoreDto>>(`/franchise-stores/${id}`, data);
    return res.data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete<ApiResult<boolean>>(`/franchise-stores/${id}`);
  },
};

// --- Central Kitchens API: /api/central-kitchens ---

export const centralKitchensApi = {
  getAll: async (): Promise<CentralKitchenDto[]> => {
    const res = await api.get<ApiResult<CentralKitchenDto[]>>('/central-kitchens');
    return res.data.data ?? [];
  },

  getById: async (id: number): Promise<CentralKitchenDto> => {
    const res = await api.get<ApiResult<CentralKitchenDto>>(`/central-kitchens/${id}`);
    return res.data.data!;
  },

  create: async (data: CreateCentralKitchenModel): Promise<CentralKitchenDto> => {
    const res = await api.post<ApiResult<CentralKitchenDto>>('/central-kitchens', data);
    return res.data.data!;
  },

  update: async (id: number, data: UpdateCentralKitchenModel): Promise<CentralKitchenDto> => {
    const res = await api.put<ApiResult<CentralKitchenDto>>(`/central-kitchens/${id}`, data);
    return res.data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete<ApiResult<boolean>>(`/central-kitchens/${id}`);
  },
};
