import { api } from '@/app/utils/apiClient';
import type {
  ApiResponse,
  PaginatedResponse,
  ProductionPlan,
  ProductionBatch,
  CreateProductionPlanDto,
  CreateProductionBatchDto,
} from '@/app/utils/apiTypes';

export const productionApi = {
  // Production Plans
  getPlans: async (params?: { page?: number; pageSize?: number; status?: string }): Promise<PaginatedResponse<ProductionPlan>> => {
    const response = await api.get<PaginatedResponse<ProductionPlan>>('/production/plans', { params });
    return response.data;
  },

  getPlanById: async (id: string): Promise<ApiResponse<ProductionPlan>> => {
    const response = await api.get<ApiResponse<ProductionPlan>>(`/production/plans/${id}`);
    return response.data;
  },

  createPlan: async (data: CreateProductionPlanDto): Promise<ApiResponse<ProductionPlan>> => {
    const response = await api.post<ApiResponse<ProductionPlan>>('/production/plans', data);
    return response.data;
  },

  updatePlanStatus: async (id: string, status: string): Promise<ApiResponse<ProductionPlan>> => {
    const response = await api.patch<ApiResponse<ProductionPlan>>(`/production/plans/${id}/status`, { status });
    return response.data;
  },

  deletePlan: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/production/plans/${id}`);
    return response.data;
  },

  // Production Batches
  getBatches: async (params?: { page?: number; pageSize?: number; status?: string }): Promise<PaginatedResponse<ProductionBatch>> => {
    const response = await api.get<PaginatedResponse<ProductionBatch>>('/production/batches', { params });
    return response.data;
  },

  getBatchById: async (id: string): Promise<ApiResponse<ProductionBatch>> => {
    const response = await api.get<ApiResponse<ProductionBatch>>(`/production/batches/${id}`);
    return response.data;
  },

  createBatch: async (data: CreateProductionBatchDto): Promise<ApiResponse<ProductionBatch>> => {
    const response = await api.post<ApiResponse<ProductionBatch>>('/production/batches', data);
    return response.data;
  },

  updateBatchStatus: async (id: string, status: string): Promise<ApiResponse<ProductionBatch>> => {
    const response = await api.patch<ApiResponse<ProductionBatch>>(`/production/batches/${id}/status`, { status });
    return response.data;
  },

  completeBatch: async (id: string): Promise<ApiResponse<ProductionBatch>> => {
    const response = await api.post<ApiResponse<ProductionBatch>>(`/production/batches/${id}/complete`);
    return response.data;
  },

  qualityCheck: async (id: string, passed: boolean): Promise<ApiResponse<ProductionBatch>> => {
    const response = await api.post<ApiResponse<ProductionBatch>>(`/production/batches/${id}/quality-check`, { passed });
    return response.data;
  },
};
