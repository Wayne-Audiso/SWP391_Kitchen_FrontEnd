// Common API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// User Types
export interface User {
  id: string;
  userId: string;
  username: string;
  realName: string;
  role: string;
  status: 'active' | 'inactive';
  email: string;
  location: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  username: string;
  realName: string;
  email: string;
  role: string;
  location: string;
  password: string;
}

export interface UpdateUserDto {
  realName?: string;
  email?: string;
  role?: string;
  location?: string;
  status?: 'active' | 'inactive';
}

// Production Types
export interface ProductionPlan {
  id: string;
  productName: string;
  planDate: string;
  quantity: number;
  status: 'planned' | 'in-progress' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductionBatch {
  id: string;
  productName: string;
  batchId: string;
  quantity: number;
  startDate: string;
  status: 'in-progress' | 'completed' | 'quality-check';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductionPlanDto {
  productName: string;
  planDate: string;
  quantity: number;
}

export interface CreateProductionBatchDto {
  productName: string;
  quantity: number;
  startDate: string;
}

// Inventory Types
export interface Ingredient {
  id: string;
  ingredientId: string;
  name: string;
  quantity: number;
  unit: string;
  location: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  reorderLevel: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unit: string;
  location: string;
  status: 'available' | 'low-stock' | 'unavailable';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateIngredientDto {
  name: string;
  quantity: number;
  unit: string;
  location: string;
  reorderLevel: number;
}

export interface UpdateInventoryDto {
  quantity?: number;
  location?: string;
  reorderLevel?: number;
}

// Order Types
export interface Order {
  id: string;
  storeOrderId: string;
  franchiseStore: string;
  orderDate: string;
  deliveryDate: string;
  totalQuantity: number;
  status: 'pending' | 'processing' | 'shipping' | 'delivered';
  items: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Shipment {
  id: string;
  shipmentId: string;
  storeOrderId: string;
  franchiseStore: string;
  deliveryStatus: 'preparing' | 'in-transit' | 'delivered';
  receivedDate: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderDto {
  franchiseStore: string;
  deliveryDate: string;
  items: OrderItem[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
}

export interface UpdateOrderStatusDto {
  status: 'pending' | 'processing' | 'shipping' | 'delivered';
}

// Recipe Types
export interface Recipe {
  id: string;
  recipeId: string;
  name: string;
  category: string;
  servingSize: number;
  prepTime: number;
  ingredients: RecipeIngredient[];
  instructions: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RecipeIngredient {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
}

export interface CreateRecipeDto {
  name: string;
  category: string;
  servingSize: number;
  prepTime: number;
  ingredients: RecipeIngredient[];
  instructions: string[];
}

// Store Types
export interface FranchiseStore {
  id: string;
  storeId: string;
  name: string;
  location: string;
  manager: string;
  status: 'active' | 'inactive';
  contact: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStoreDto {
  name: string;
  location: string;
  manager: string;
  contact: string;
  email: string;
}

export interface UpdateStoreDto {
  name?: string;
  location?: string;
  manager?: string;
  status?: 'active' | 'inactive';
  contact?: string;
  email?: string;
}

// Dashboard/Statistics Types
export interface DashboardStats {
  totalOrders: number;
  activeStores: number;
  productionBatches: number;
  lowStockItems: number;
  recentOrders: Order[];
  recentProduction: ProductionBatch[];
}

// Auth Types
export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}
