import { api } from '@/app/utils/apiClient';
import type { ApiResult } from '@/app/utils/apiTypes';

// ── Types khớp với backend StoreOrderDto ─────────────────────────────────────

export interface StoreOrderDto {
  storeOrderId: number;
  centralKitchenId: number;
  kitchenName?: string;
  franchiseStoreId: number;
  storeName?: string;
  orderDate?: string;
  status?: string;
  quantity?: number;
  deliveryDate?: string;
}

export interface CreateStoreOrderModel {
  centralKitchenId: number;
  franchiseStoreId: number;
  quantity?: number;
  deliveryDate?: string;
}

export interface UpdateStoreOrderStatusModel {
  /** Luồng: Pending → Approved / Rejected → InProduction → InDelivery → Completed */
  status: string;
}

// ── Types khớp với backend ShipmentDto ────────────────────────────────────────

export interface ShipmentLineDto {
  shipmentLineId: number;
  productId: number;
  productName?: string;
  shippedQuantity?: number;
  receivedQuantity?: number;
  damagedQuantity?: number;
}

export interface ShipmentDto {
  shipmentId: number;
  storeOrderId: number;
  centralKitchenId: number;
  kitchenName?: string;
  shipmentDate?: string;
  deliveryStatus?: string;
  receivedDate?: string;
  lines: ShipmentLineDto[];
}

export interface CreateShipmentLineModel {
  productId: number;
  shippedQuantity?: number;
}

export interface CreateShipmentModel {
  storeOrderId: number;
  centralKitchenId: number;
  lines: CreateShipmentLineModel[];
}

export interface UpdateShipmentStatusModel {
  deliveryStatus: string;
}

export interface ReceiveShipmentLineModel {
  shipmentLineId: number;
  receivedQuantity?: number;
  damagedQuantity?: number;
}

export interface ReceiveShipmentModel {
  lines: ReceiveShipmentLineModel[];
}

// ── Store Orders API: /api/store-orders ──────────────────────────────────────

export const storeOrdersApi = {
  getAll: async (): Promise<StoreOrderDto[]> => {
    const res = await api.get<ApiResult<StoreOrderDto[]>>('/store-orders');
    return res.data.data ?? [];
  },

  getById: async (id: number): Promise<StoreOrderDto> => {
    const res = await api.get<ApiResult<StoreOrderDto>>(`/store-orders/${id}`);
    return res.data.data!;
  },

  getByStore: async (storeId: number): Promise<StoreOrderDto[]> => {
    const res = await api.get<ApiResult<StoreOrderDto[]>>(`/store-orders/by-store/${storeId}`);
    return res.data.data ?? [];
  },

  create: async (data: CreateStoreOrderModel): Promise<StoreOrderDto> => {
    const res = await api.post<ApiResult<StoreOrderDto>>('/store-orders', data);
    return res.data.data!;
  },

  updateStatus: async (id: number, data: UpdateStoreOrderStatusModel): Promise<StoreOrderDto> => {
    const res = await api.put<ApiResult<StoreOrderDto>>(`/store-orders/${id}/status`, data);
    return res.data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete<ApiResult<boolean>>(`/store-orders/${id}`);
  },
};

// ── Shipments API: /api/shipments ─────────────────────────────────────────────

export const shipmentsApi = {
  getAll: async (): Promise<ShipmentDto[]> => {
    const res = await api.get<ApiResult<ShipmentDto[]>>('/shipments');
    return res.data.data ?? [];
  },

  getById: async (id: number): Promise<ShipmentDto> => {
    const res = await api.get<ApiResult<ShipmentDto>>(`/shipments/${id}`);
    return res.data.data!;
  },

  getByOrder: async (orderId: number): Promise<ShipmentDto[]> => {
    const res = await api.get<ApiResult<ShipmentDto[]>>(`/shipments/by-order/${orderId}`);
    return res.data.data ?? [];
  },

  create: async (data: CreateShipmentModel): Promise<ShipmentDto> => {
    const res = await api.post<ApiResult<ShipmentDto>>('/shipments', data);
    return res.data.data!;
  },

  updateStatus: async (id: number, data: UpdateShipmentStatusModel): Promise<ShipmentDto> => {
    const res = await api.put<ApiResult<ShipmentDto>>(`/shipments/${id}/status`, data);
    return res.data.data!;
  },

  receive: async (id: number, data: ReceiveShipmentModel): Promise<ShipmentDto> => {
    const res = await api.put<ApiResult<ShipmentDto>>(`/shipments/${id}/receive`, data);
    return res.data.data!;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete<ApiResult<boolean>>(`/shipments/${id}`);
  },
};
