import { api } from '@/app/utils/apiClient';
import type {
  ApiResponse,
  PaginatedResponse,
  Order,
  Shipment,
  CreateOrderDto,
  UpdateOrderStatusDto,
} from '@/app/utils/apiTypes';

export const ordersApi = {
  // Orders
  getOrders: async (params?: { page?: number; pageSize?: number; status?: string; franchiseStore?: string }): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<PaginatedResponse<Order>>('/orders', { params });
    return response.data;
  },

  getOrderById: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (data: CreateOrderDto): Promise<ApiResponse<Order>> => {
    const response = await api.post<ApiResponse<Order>>('/orders', data);
    return response.data;
  },

  updateOrderStatus: async (id: string, data: UpdateOrderStatusDto): Promise<ApiResponse<Order>> => {
    const response = await api.patch<ApiResponse<Order>>(`/orders/${id}/status`, data);
    return response.data;
  },

  deleteOrder: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/orders/${id}`);
    return response.data;
  },

  // Order Workflow
  processOrder: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await api.post<ApiResponse<Order>>(`/orders/${id}/process`);
    return response.data;
  },

  shipOrder: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await api.post<ApiResponse<Order>>(`/orders/${id}/ship`);
    return response.data;
  },

  deliverOrder: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await api.post<ApiResponse<Order>>(`/orders/${id}/deliver`);
    return response.data;
  },

  cancelOrder: async (id: string, reason: string): Promise<ApiResponse<Order>> => {
    const response = await api.post<ApiResponse<Order>>(`/orders/${id}/cancel`, { reason });
    return response.data;
  },

  // Shipments
  getShipments: async (params?: { page?: number; pageSize?: number; status?: string }): Promise<PaginatedResponse<Shipment>> => {
    const response = await api.get<PaginatedResponse<Shipment>>('/shipments', { params });
    return response.data;
  },

  getShipmentById: async (id: string): Promise<ApiResponse<Shipment>> => {
    const response = await api.get<ApiResponse<Shipment>>(`/shipments/${id}`);
    return response.data;
  },

  updateShipmentStatus: async (id: string, status: string): Promise<ApiResponse<Shipment>> => {
    const response = await api.patch<ApiResponse<Shipment>>(`/shipments/${id}/status`, { status });
    return response.data;
  },

  markShipmentDelivered: async (id: string): Promise<ApiResponse<Shipment>> => {
    const response = await api.post<ApiResponse<Shipment>>(`/shipments/${id}/delivered`);
    return response.data;
  },

  // Get shipments by order
  getShipmentsByOrder: async (orderId: string): Promise<ApiResponse<Shipment[]>> => {
    const response = await api.get<ApiResponse<Shipment[]>>(`/orders/${orderId}/shipments`);
    return response.data;
  },
};
