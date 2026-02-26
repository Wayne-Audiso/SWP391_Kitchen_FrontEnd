import { api } from '@/app/utils/apiClient';

// --- Types khớp với backend models ---

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
export const productsApi = {
  getAll: async (): Promise<ProductDto[]> => {
    const response = await api.get<ProductDto[]>('/products');
    return response.data;
  },

  getById: async (id: number): Promise<ProductDto> => {
    const response = await api.get<ProductDto>(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductModel): Promise<ProductDto> => {
    const response = await api.post<ProductDto>('/products', data);
    return response.data;
  },

  update: async (id: number, data: UpdateProductModel): Promise<ProductDto> => {
    const response = await api.put<ProductDto>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

// --- Product Types API: /api/product-types ---
export const productTypesApi = {
  getAll: async (): Promise<ProductTypeDto[]> => {
    const response = await api.get<ProductTypeDto[]>('/product-types');
    return response.data;
  },

  getById: async (id: number): Promise<ProductTypeDto> => {
    const response = await api.get<ProductTypeDto>(`/product-types/${id}`);
    return response.data;
  },

  create: async (data: CreateProductTypeModel): Promise<ProductTypeDto> => {
    const response = await api.post<ProductTypeDto>('/product-types', data);
    return response.data;
  },

  update: async (id: number, data: UpdateProductTypeModel): Promise<ProductTypeDto> => {
    const response = await api.put<ProductTypeDto>(`/product-types/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/product-types/${id}`);
  },
};
