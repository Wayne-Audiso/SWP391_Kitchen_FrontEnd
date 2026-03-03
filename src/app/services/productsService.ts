import { api } from '@/app/utils/apiClient';
import type { ApiResult } from '@/app/utils/apiTypes';

// --- Types khớp với backend DTOs ---

export interface ProductDto {
  productId: number;
  productTypeId: number;
  productTypeName?: string;
  productName: string;
  status?: string;
  unit?: string;
}

export interface ProductTypeDto {
  productTypeId: number;
  typeName: string;
  description?: string;
  storageCondition?: string;
}

export interface CreateProductModel {
  productTypeId: number;
  productName: string;
  unit?: string;
}

export interface UpdateProductModel {
  productTypeId: number;
  productName: string;
  status?: string;
  unit?: string;
}

export interface CreateProductTypeModel {
  typeName: string;
  description?: string;
  storageCondition?: string;
}

export interface UpdateProductTypeModel {
  typeName: string;
  description?: string;
  storageCondition?: string;
}

// --- Products API: /api/products ---
// Backend bọc kết quả trong ApiResult<T> — service unwrap về T trực tiếp.

export const productsApi = {
  getAll: async (): Promise<ProductDto[]> => {
    const res = await api.get<ApiResult<ProductDto[]>>('/products');
    return res.data.data ?? [];
  },

  getById: async (id: number): Promise<ProductDto> => {
    const res = await api.get<ApiResult<ProductDto>>(`/products/${id}`);
    return res.data.data!;
  },

  create: async (data: CreateProductModel): Promise<ProductDto> => {
    const res = await api.post<ApiResult<ProductDto>>('/products', data);
    return res.data.data!;
  },

  update: async (id: number, data: UpdateProductModel): Promise<ProductDto> => {
    const res = await api.put<ApiResult<ProductDto>>(`/products/${id}`, data);
    return res.data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete<ApiResult<boolean>>(`/products/${id}`);
  },
};

// --- Product Types API: /api/product-types ---

export const productTypesApi = {
  getAll: async (): Promise<ProductTypeDto[]> => {
    const res = await api.get<ApiResult<ProductTypeDto[]>>('/product-types');
    return res.data.data ?? [];
  },

  getById: async (id: number): Promise<ProductTypeDto> => {
    const res = await api.get<ApiResult<ProductTypeDto>>(`/product-types/${id}`);
    return res.data.data!;
  },

  create: async (data: CreateProductTypeModel): Promise<ProductTypeDto> => {
    const res = await api.post<ApiResult<ProductTypeDto>>('/product-types', data);
    return res.data.data!;
  },

  update: async (id: number, data: UpdateProductTypeModel): Promise<ProductTypeDto> => {
    const res = await api.put<ApiResult<ProductTypeDto>>(`/product-types/${id}`, data);
    return res.data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete<ApiResult<boolean>>(`/product-types/${id}`);
  },
};
