import { api } from '@/app/utils/apiClient';
import type {
  ApiResponse,
  DashboardStats,
} from '@/app/utils/apiTypes';

export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return response.data;
  },

  getRecentActivities: async (params?: { limit?: number }): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>('/dashboard/activities', { params });
    return response.data;
  },

  getPendingTasks: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>('/dashboard/tasks');
    return response.data;
  },

  // Analytics
  getOrdersAnalytics: async (params?: { startDate?: string; endDate?: string }): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>('/dashboard/analytics/orders', { params });
    return response.data;
  },

  getProductionAnalytics: async (params?: { startDate?: string; endDate?: string }): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>('/dashboard/analytics/production', { params });
    return response.data;
  },

  getInventoryAnalytics: async (): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>('/dashboard/analytics/inventory');
    return response.data;
  },

  // Reports
  generateReport: async (type: string, params?: any): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>('/dashboard/reports/generate', { type, ...params });
    return response.data;
  },

  downloadReport: async (reportId: string): Promise<Blob> => {
    const response = await api.get(`/dashboard/reports/${reportId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
