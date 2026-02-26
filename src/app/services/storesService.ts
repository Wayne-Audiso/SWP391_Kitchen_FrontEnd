import { api } from '@/app/utils/apiClient';

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
export const franchiseStoresApi = {
  getAll: async (): Promise<FranchiseStoreDto[]> => {
    const response = await api.get<FranchiseStoreDto[]>('/franchise-stores');
    return response.data;
  },

  getById: async (id: number): Promise<FranchiseStoreDto> => {
    const response = await api.get<FranchiseStoreDto>(`/franchise-stores/${id}`);
    return response.data;
  },

  create: async (data: CreateFranchiseStoreModel): Promise<FranchiseStoreDto> => {
    const response = await api.post<FranchiseStoreDto>('/franchise-stores', data);
    return response.data;
  },

  update: async (id: number, data: UpdateFranchiseStoreModel): Promise<FranchiseStoreDto> => {
    const response = await api.put<FranchiseStoreDto>(`/franchise-stores/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/franchise-stores/${id}`);
  },
};

// --- Central Kitchens API: /api/central-kitchens ---
export const centralKitchensApi = {
  getAll: async (): Promise<CentralKitchenDto[]> => {
    const response = await api.get<CentralKitchenDto[]>('/central-kitchens');
    return response.data;
  },

  getById: async (id: number): Promise<CentralKitchenDto> => {
    const response = await api.get<CentralKitchenDto>(`/central-kitchens/${id}`);
    return response.data;
  },

  create: async (data: CreateCentralKitchenModel): Promise<CentralKitchenDto> => {
    const response = await api.post<CentralKitchenDto>('/central-kitchens', data);
    return response.data;
  },

  update: async (id: number, data: UpdateCentralKitchenModel): Promise<CentralKitchenDto> => {
    const response = await api.put<CentralKitchenDto>(`/central-kitchens/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/central-kitchens/${id}`);
  },
};
