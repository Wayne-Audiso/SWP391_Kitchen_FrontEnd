# Permission Matrix Implementation

This document describes the complete role-based access control system implemented based on the provided permission spreadsheet.

## Overview

The system implements a comprehensive permission matrix for 5 distinct roles, each with specific functions and page access permissions.

## Roles & Functions

### 1. Admin (10 Functions: AD-01 to AD-10)

| ID | Function | Description | Level |
|---|---|---|---|
| AD-01 | Login / Logout | Đăng nhập, đăng xuất hệ thống | Simple |
| AD-02 | User Management | CRUD user | Medium |
| AD-03 | Role Management | CRUD role | Medium |
| AD-04 | Permission Management | Gán quyền theo role | Complex |
| AD-05 | Franchise Store Management | CRUD cửa hàng Franchise | Medium |
| AD-06 | Central Kitchen Management | CRUD bếp trung tâm | Medium |
| AD-07 | Product Management | CRUD Product Type & Product | Medium |
| AD-08 | System Configuration | Cấu hình đơn vị tính, ngưỡng tồn kho, quy tắc | Complex |
| AD-09 | View System Log | Xem log hoạt động | Medium |
| AD-10 | System-wide Reports | Báo cáo tổng toàn hệ thống | Complex |

**Accessible Pages:** Home, Dashboard, Users, Stores, Recipes, Inventory, Production, Orders

---

### 2. Manager (13 Functions: MG-00 to MG-12)

| ID | Function | Description | Level |
|---|---|---|---|
| MG-00 | Login / Logout | Đăng nhập/Đăng xuất | Simple |
| MG-01 | Dashboard | Tổng quan toàn chuỗi | Medium |
| MG-02 | Product Type Management | CRUD sản phẩm | Simple |
| MG-03 | Product Management | CRUD sản phẩm | Medium |
| MG-04 | Update Product Status | Active / Inactive sản phẩm | Simple |
| MG-05 | Recipe Management | CRUD công thức | Complex |
| MG-06 | Ingredient Management | CRUD nguyên liệu | Medium |
| MG-07 | View Production Performance | Theo dõi sản xuất | Complex |
| MG-08 | View Distribution Performance | Theo dõi giao hàng | Complex |
| MG-09 | Cost & Waste Management | Thống kê chi phí, hao hụt | Complex |
| MG-10 | Aggregate Store Orders | Gộp đơn | Medium |
| MG-11 | KPI Monitoring | Theo dõi KPI | Complex |
| MG-12 | Multi-Store Reports | Xuất báo cáo | Medium |

**Accessible Pages:** Home, Dashboard, Recipes, Inventory, Production, Orders, Stores

---

### 3. Franchise Store Staff (10 Functions: FS-01 to FS-10)

| ID | Function | Description | Level |
|---|---|---|---|
| FS-01 | Login / Logout | Đăng nhập hệ thống | Simple |
| FS-02 | Store Dashboard | Tổng quan cửa hàng | Medium |
| FS-03 | View Store Inventory | Xem tồn kho cửa hàng | Medium |
| FS-04 | Create Store Order | Tạo đơn đặt hàng | Complex |
| FS-05 | Edit / Update Order | Sửa / hủy đơn | Medium |
| FS-06 | View Order Status | Theo dõi trạng thái đơn | Medium |
| FS-07 | Confirm Receipt Goods | Xác nhận nhận hàng | Medium |
| FS-08 | Quality Feedback | Phản hồi chất lượng | Medium |
| FS-09 | Log Delivery Issues | Lưu sự cố giao hàng | Medium |
| FS-10 | View Product Catalog | Xem danh mục sản phẩm | Simple |

**Accessible Pages:** Home, Dashboard, Inventory, Orders, Recipes

---

### 4. Central Kitchen Staff (11 Functions: CK-01 to CK-11)

| ID | Function | Description | Level |
|---|---|---|---|
| CK-01 | Login / Logout | Đăng nhập | Simple |
| CK-02 | Kitchen Dashboard | Tổng quan bếp | Medium |
| CK-03 | View Incoming Orders | Xem đơn từ cửa hàng | Medium |
| CK-04 | Accept / Reject Order | Nhận / từ chối đơn | Medium |
| CK-05 | Production Planning | Lập kế hoạch sản xuất | Complex |
| CK-06 | Update Production Status | Cập nhật trạng thái | Complex |
| CK-07 | Raw Material Ordering | Quản lý nguyên liệu | Complex |
| CK-08 | Batch & Expiry Tracking | Quản lý lô & hạn | Complex |
| CK-09 | Prepare Shipment | Chuẩn bị giao hàng | Medium |
| CK-10 | Update Shipment Status | Cập nhật trạng thái giao hàng | Medium |
| CK-11 | Record Damages | Ghi nhận hao hụt | Medium |

**Accessible Pages:** Home, Dashboard, Production, Inventory, Orders, Recipes

---

### 5. Supply Coordinator (11 Functions: SC-00 to SC-10)

| ID | Function | Description | Level |
|---|---|---|---|
| SC-00 | Login / Logout | Đăng nhập/Đăng xuất | Simple |
| SC-01 | Dashboard | Tổng hợp đơn | Medium |
| SC-02 | View All Store Orders | Xem toàn bộ đơn | Medium |
| SC-03 | Aggregate Orders | Gộp đơn | Medium |
| SC-04 | Prioritize Orders | Ưu tiên đơn | Complex |
| SC-05 | Resolve Stock Issues | Xử lý thiếu hàng | Complex |
| SC-06 | Reschedule Delivery | Điều chỉnh lịch giao | Complex |
| SC-07 | Cancel / Adjust Orders | Điều chỉnh đơn | Medium |
| SC-08 | Notify Stores & Kitchen | Gửi thông báo | Medium |
| SC-09 | Delivery Monitoring | Theo dõi giao hàng | Medium |
| SC-10 | Incident Report | Báo cáo sự cố | Medium |

**Accessible Pages:** Home, Dashboard, Orders, Inventory, Stores

---

## Implementation Details

### File Structure

```
/src/app/utils/permissions.ts          # Core permission system
/src/app/components/HomePage.tsx       # Role-based home page
/src/app/components/Sidebar.tsx        # Role-based navigation
/src/app/components/LoginPage.tsx      # Authentication with demo users
```

### Key Features

1. **Role-Based Access Control (RBAC)**
   - Each role has specific page access permissions
   - Sidebar dynamically filters menu items based on role
   - HomePage displays only authorized functions

2. **Function Classification**
   - **Simple**: Basic, straightforward operations
   - **Medium**: Standard operations requiring some expertise
   - **Complex**: Advanced operations requiring significant expertise

3. **Dynamic UI**
   - Visual indicators for function complexity levels
   - Color-coded role badges
   - Function count displays
   - Filtered activities and tasks based on role

4. **Demo Users**
   - Admin: `admin` / any password
   - Manager: `manager` / any password
   - Kitchen Staff: `kitchen` / any password
   - Supply Coordinator: `coordinator` / any password
   - Store Staff: `store` / any password

### Color Coding

**Complexity Levels:**
- Simple: Green
- Medium: Blue
- Complex: Purple

**Roles:**
- Admin: Purple (#9333EA)
- Manager: Blue (#2563EB)
- Central Kitchen Staff: Green (#16A34A)
- Supply Coordinator: Orange (#EA580C)
- Franchise Store Staff: Cyan (#0891B2)

### Usage

1. **Login** with any of the demo credentials
2. **Navigate** using the role-filtered sidebar menu
3. **View Functions** on the HomePage specific to your role
4. **Switch Roles** (demo mode) using the dropdown selector on HomePage
5. **Logout** using the user menu in the sidebar

### Permission Checks

The system uses utility functions to verify permissions:

```typescript
// Check if user has access to a page
hasPageAccess(role: Role, page: string): boolean

// Get all accessible pages for a role
getAccessiblePages(role: Role): string[]

// Get all functions for a role
getFunctionsByRole(role: Role): FunctionItem[]
```

### Security Notes

- In production, implement server-side permission validation
- Add role-based API endpoint protection
- Implement proper authentication with secure password handling
- Add audit logging for sensitive operations
- Consider implementing permission delegation features
