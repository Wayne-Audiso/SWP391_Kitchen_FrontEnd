import { api } from '@/app/utils/apiClient';
import type {
  ApiResponse,
  DashboardStats,
  JsonValue,
} from '@/app/utils/apiTypes';

export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data;
  },

  getRecentActivities: async (params?: { limit?: number }): Promise<ApiResponse<JsonValue[]>> => {
    const response = await api.get<ApiResponse<JsonValue[]>>('/dashboard/activities', { params });
    return response.data;
  },

  getPendingTasks: async (): Promise<ApiResponse<JsonValue[]>> => {
    const response = await api.get<ApiResponse<JsonValue[]>>('/dashboard/tasks');
    return response.data;
  },

  getOrdersAnalytics: async (params?: { startDate?: string; endDate?: string }): Promise<ApiResponse<JsonValue>> => {
    const response = await api.get<ApiResponse<JsonValue>>('/dashboard/analytics/orders', { params });
    return response.data;
  },

  getProductionAnalytics: async (params?: { startDate?: string; endDate?: string }): Promise<ApiResponse<JsonValue>> => {
    const response = await api.get<ApiResponse<JsonValue>>('/dashboard/analytics/production', { params });
    return response.data;
  },

  getInventoryAnalytics: async (): Promise<ApiResponse<JsonValue>> => {
    const response = await api.get<ApiResponse<JsonValue>>('/dashboard/analytics/inventory');
    return response.data;
  },

  generateReport: async (type: string, params?: Record<string, JsonValue>): Promise<ApiResponse<JsonValue>> => {
    const response = await api.post<ApiResponse<JsonValue>>('/dashboard/reports/generate', { type, ...params });
    return response.data;
  },

  downloadReport: async (reportId: string): Promise<Blob> => {
    const response = await api.get(`/dashboard/reports/${reportId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
