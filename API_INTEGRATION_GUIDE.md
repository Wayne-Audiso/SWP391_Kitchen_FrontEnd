# API Integration Guide

## Overview
This project includes a complete API integration infrastructure ready to connect with your backend REST API.

## Configuration

### 1. Set Backend URL
Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3000/api
# or your production API URL
# VITE_API_BASE_URL=https://api.yourdomain.com
```

### 2. Backend API Requirements
Your backend should implement these endpoints:

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh token

#### Users
- `GET /users` - Get all users (paginated)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `PATCH /users/:id/toggle-status` - Toggle user status

#### Production
- `GET /production/plans` - Get production plans
- `POST /production/plans` - Create production plan
- `PATCH /production/plans/:id/status` - Update plan status
- `GET /production/batches` - Get production batches
- `POST /production/batches` - Create production batch
- `PATCH /production/batches/:id/status` - Update batch status

#### Inventory
- `GET /inventory/ingredients` - Get ingredients
- `POST /inventory/ingredients` - Create ingredient
- `PATCH /inventory/ingredients/:id` - Update ingredient
- `GET /inventory/products` - Get products
- `PATCH /inventory/products/:id/stock` - Update product stock
- `GET /inventory/low-stock` - Get low stock items

#### Orders
- `GET /orders` - Get orders (paginated)
- `POST /orders` - Create order
- `PATCH /orders/:id/status` - Update order status
- `POST /orders/:id/process` - Process order
- `POST /orders/:id/ship` - Ship order
- `POST /orders/:id/deliver` - Deliver order
- `GET /shipments` - Get shipments

#### Recipes
- `GET /recipes` - Get all recipes
- `POST /recipes` - Create recipe
- `PATCH /recipes/:id` - Update recipe
- `DELETE /recipes/:id` - Delete recipe

#### Stores
- `GET /stores` - Get franchise stores
- `POST /stores` - Create store
- `PATCH /stores/:id` - Update store
- `DELETE /stores/:id` - Delete store

#### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics
- `GET /dashboard/activities` - Get recent activities
- `GET /dashboard/analytics/orders` - Get orders analytics

## Usage Examples

### 1. Using API Services Directly

```typescript
import { usersApi } from '@/app/services/authService';
import { productionApi } from '@/app/services/productionService';

// Get all users
const response = await usersApi.getAll({ page: 1, pageSize: 10 });
console.log(response.data); // Array of users

// Create production plan
const newPlan = await productionApi.createPlan({
  productName: 'Fresh Bread',
  planDate: '2026-02-01',
  quantity: 500,
});
```

### 2. Using Custom Hooks (Recommended)

```typescript
import { useApi, usePaginatedApi, useMutation } from '@/app/hooks/useApi';
import { usersApi } from '@/app/services/authService';

function UsersPage() {
  // Fetch paginated users
  const {
    data: users,
    loading,
    error,
    page,
    totalPages,
    nextPage,
    prevPage,
    refresh,
  } = usePaginatedApi(usersApi.getAll, {
    immediate: true,
    initialPage: 1,
    initialPageSize: 10,
  });

  // Create user mutation
  const { mutate: createUser, loading: creating } = useMutation(
    usersApi.create,
    {
      successMessage: 'User created successfully!',
      onSuccess: () => {
        refresh(); // Refresh the list
      },
    }
  );

  const handleCreateUser = async () => {
    await createUser({
      username: 'newuser',
      realName: 'New User',
      email: 'newuser@example.com',
      role: 'Manager',
      location: 'Central Kitchen',
      password: 'password123',
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {users?.map((user) => (
        <div key={user.id}>{user.realName}</div>
      ))}
      <button onClick={prevPage}>Previous</button>
      <button onClick={nextPage}>Next</button>
      <button onClick={handleCreateUser} disabled={creating}>
        Create User
      </button>
    </div>
  );
}
```

### 3. Complex Example with Multiple Operations

```typescript
import { useState } from 'react';
import { useApi, useMutation } from '@/app/hooks/useApi';
import { ordersApi } from '@/app/services/ordersService';

function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Fetch orders with filter
  const { data: orders, loading, execute: fetchOrders } = useApi(
    (params) => ordersApi.getOrders(params),
    { immediate: true }
  );

  // Update order status
  const { mutate: updateStatus } = useMutation(ordersApi.updateOrderStatus, {
    successMessage: 'Order status updated!',
    onSuccess: () => {
      fetchOrders({ status: selectedStatus });
    },
  });

  // Process order
  const { mutate: processOrder } = useMutation(ordersApi.processOrder, {
    successMessage: 'Order is being processed!',
    onSuccess: () => {
      fetchOrders({ status: selectedStatus });
    },
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateStatus(orderId, { status: newStatus });
  };

  const handleProcessOrder = async (orderId: string) => {
    await processOrder(orderId);
  };

  // Refetch when filter changes
  useEffect(() => {
    fetchOrders({ status: selectedStatus !== 'all' ? selectedStatus : undefined });
  }, [selectedStatus]);

  return (
    <div>
      <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipping">Shipping</option>
        <option value="delivered">Delivered</option>
      </select>

      {loading ? (
        <div>Loading...</div>
      ) : (
        orders?.data?.map((order) => (
          <div key={order.id}>
            <h3>{order.storeOrderId}</h3>
            <p>Status: {order.status}</p>
            {order.status === 'pending' && (
              <button onClick={() => handleProcessOrder(order.id)}>Process</button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
```

## Features

### Automatic Token Management
- Auth tokens are automatically added to request headers
- Tokens are stored in localStorage
- Automatic logout on 401 errors

### Error Handling
- Global error handling with toast notifications
- Network error detection
- Custom error messages per status code

### Loading States
- Built-in loading states for all API calls
- Easy to show loading spinners

### Pagination Support
- `usePaginatedApi` hook for paginated data
- Automatic page, pageSize, total tracking
- Next/Previous page helpers

### Type Safety
- Full TypeScript support
- Type definitions for all API responses
- Auto-complete in IDE

## Migration from Mock Data

To migrate from mock data to real API:

1. Replace mock data imports with API hooks:
```typescript
// Before
const [users, setUsers] = useState(mockUsers);

// After
const { data: users, loading } = useApi(usersApi.getAll, { immediate: true });
```

2. Update CRUD operations:
```typescript
// Before
const handleCreate = (newUser) => {
  setUsers([...users, newUser]);
};

// After
const { mutate: createUser } = useMutation(usersApi.create, {
  onSuccess: () => {
    // Optionally refresh list
  },
});

const handleCreate = (newUser) => {
  createUser(newUser);
};
```

## Testing Without Backend

The current mock data setup allows you to develop and test the UI without a backend. When your backend is ready:

1. Set the `VITE_API_BASE_URL` environment variable
2. Replace mock API calls with real API services
3. The application will automatically connect to your backend

## API Response Format

All API responses should follow this format:

```typescript
// Success Response
{
  "success": true,
  "data": { /* your data */ },
  "message": "Optional success message"
}

// Paginated Response
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 100,
    "totalPages": 10
  }
}

// Error Response
{
  "success": false,
  "message": "Error message",
  "errors": { /* validation errors */ }
}
```

## Available Services

- `authService.ts` - Authentication & Users
- `productionService.ts` - Production Plans & Batches
- `inventoryService.ts` - Ingredients & Products
- `ordersService.ts` - Orders & Shipments
- `recipesService.ts` - Recipe Management
- `storesService.ts` - Franchise Stores
- `dashboardService.ts` - Dashboard & Analytics

## Support

For questions or issues with API integration, please refer to:
- API Types: `/src/app/utils/apiTypes.ts`
- API Client: `/src/app/utils/apiClient.ts`
- Custom Hooks: `/src/app/hooks/useApi.ts`
