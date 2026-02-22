// Permission Matrix based on the provided spreadsheet
export type Role = 'Admin' | 'Manager' | 'Franchise Store Staff' | 'Central Kitchen Staff' | 'Supply Coordinator';

export interface FunctionItem {
  id: string;
  title: string;
  description: string;
  level: 'Simple' | 'Medium' | 'Complex';
  sprint: string;
  status: string;
}

// Admin Functions (AD-01 to AD-10)
export const adminFunctions: FunctionItem[] = [
  {
    id: 'AD-01',
    title: 'Login / Logout',
    description: 'Đăng nhập, đăng xuất hệ thống',
    level: 'Simple',
    sprint: '',
    status: ''
  },
  {
    id: 'AD-02',
    title: 'User Management',
    description: 'CRUD user',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'AD-03',
    title: 'Role Management',
    description: 'CRUD role',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'AD-04',
    title: 'Permission Management',
    description: 'Gán quyền theo role',
    level: 'Complex',
    sprint: '',
    status: ''
  },
  {
    id: 'AD-05',
    title: 'Franchise Store Management',
    description: 'CRUD cửa hàng Franchise',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'AD-06',
    title: 'Central Kitchen Management',
    description: 'CRUD bếp trung tâm',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'AD-07',
    title: 'Product Management',
    description: 'CRUD Product Type & Product',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'AD-08',
    title: 'System Configuration',
    description: 'Cấu hình đơn vị tính, ngưỡng tồn kho, quy tắc',
    level: 'Complex',
    sprint: '',
    status: ''
  },
  {
    id: 'AD-09',
    title: 'View System Log',
    description: 'Xem log hoạt động',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'AD-10',
    title: 'System-wide Reports',
    description: 'Báo cáo tổng toàn hệ thống',
    level: 'Complex',
    sprint: '',
    status: ''
  }
];

// Manager Functions (MG-00 to MG-12)
export const managerFunctions: FunctionItem[] = [
  {
    id: 'MG-00',
    title: 'Login / Logout',
    description: 'Đăng nhập/Đăng xuất',
    level: 'Simple',
    sprint: '',
    status: ''
  },
  {
    id: 'MG-01',
    title: 'Dashboard',
    description: 'Tổng quan toàn chuỗi',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'MG-02',
    title: 'Product Type Management',
    description: 'CRUD sản phẩm',
    level: 'Simple',
    sprint: '',
    status: ''
  },
  {
    id: 'MG-03',
    title: 'Product Management',
    description: 'CRUD sản phẩm',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'MG-04',
    title: 'Update Product Status',
    description: 'Active / Inactive sản phẩm',
    level: 'Simple',
    sprint: '',
    status: ''
  },
  {
    id: 'MG-05',
    title: 'Recipe Management',
    description: 'CRUD công thức',
    level: 'Complex',
    sprint: '',
    status: ''
  },
  {
    id: 'MG-06',
    title: 'Ingredient Management',
    description: 'CRUD nguyên liệu',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'MG-07',
    title: 'View Production Performance',
    description: 'Theo dõi sản xuất',
    level: 'Complex',
    sprint: '',
    status: ''
  },
  {
    id: 'MG-08',
    title: 'View Distribution Performance',
    description: 'Theo dõi giao hàng',
    level: 'Complex',
    sprint: '',
    status: ''
  },
  {
    id: 'MG-09',
    title: 'Cost & Waste Management',
    description: 'Thống kê chi phí, hao hụt',
    level: 'Complex',
    sprint: '',
    status: ''
  },
  {
    id: 'MG-10',
    title: 'Aggregate Store Orders',
    description: 'Gộp đơn',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'MG-11',
    title: 'KPI Monitoring',
    description: 'Theo dõi KPI',
    level: 'Complex',
    sprint: '',
    status: ''
  },
  {
    id: 'MG-12',
    title: 'Multi-Store Reports',
    description: 'Xuất báo cáo',
    level: 'Medium',
    sprint: '',
    status: ''
  }
];

// Franchise Store Staff Functions (FS-01 to FS-10)
export const franchiseStoreStaffFunctions: FunctionItem[] = [
  {
    id: 'FS-01',
    title: 'Login / Logout',
    description: 'Đăng nhập hệ thống',
    level: 'Simple',
    sprint: '',
    status: ''
  },
  {
    id: 'FS-02',
    title: 'Store Dashboard',
    description: 'Tổng quan cửa hàng',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'FS-03',
    title: 'View Store Inventory',
    description: 'Xem tồn kho cửa hàng',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'FS-04',
    title: 'Create Store Order',
    description: 'Tạo đơn đặt hàng',
    level: 'Complex',
    sprint: '',
    status: ''
  },
  {
    id: 'FS-05',
    title: 'Edit / Update Order',
    description: 'Sửa / hủy đơn',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'FS-06',
    title: 'View Order Status',
    description: 'Theo dõi trạng thái đơn',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'FS-07',
    title: 'Confirm Receipt Goods',
    description: 'Xác nhận nhận hàng',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'FS-08',
    title: 'Quality Feedback',
    description: 'Phản hồi chất lượng',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'FS-09',
    title: 'Log Delivery Issues',
    description: 'Lưu sự cố giao hàng',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'FS-10',
    title: 'View Product Catalog',
    description: 'Xem danh mục sản phẩm',
    level: 'Simple',
    sprint: '',
    status: ''
  }
];

// Central Kitchen Staff Functions (CK-01 to CK-11)
export const centralKitchenStaffFunctions: FunctionItem[] = [
  {
    id: 'CK-01',
    title: 'Login / Logout',
    description: 'Đăng nhập',
    level: 'Simple',
    sprint: '',
    status: ''
  },
  {
    id: 'CK-02',
    title: 'Kitchen Dashboard',
    description: 'Tổng quan bếp',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'CK-03',
    title: 'View Incoming Orders',
    description: 'Xem đơn từ cửa hàng',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'CK-04',
    title: 'Accept / Reject Order',
    description: 'Nhận / từ chối đơn',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'CK-05',
    title: 'Production Planning',
    description: 'Lập kế hoạch sản xuất',
    level: 'Complex',
    sprint: '',
    status: ''
  },
  {
    id: 'CK-06',
    title: 'Update Production Status',
    description: 'Cập nhật trạng thái',
    level: 'Complex',
    sprint: '',
    status: ''
  },
  {
    id: 'CK-07',
    title: 'Raw Material Ordering',
    description: 'Quản lý nguyên liệu',
    level: 'Complex',
    sprint: '',
    status: ''
  },
  {
    id: 'CK-08',
    title: 'Batch & Expiry Tracking',
    description: 'Quản lý lô & hạn',
    level: 'Complex',
    sprint: '',
    status: ''
  },
  {
    id: 'CK-09',
    title: 'Prepare Shipment',
    description: 'Chuẩn bị giao hàng',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'CK-10',
    title: 'Update Shipment Status',
    description: 'Cập nhật trạng thái giao hàng',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'CK-11',
    title: 'Record Damages',
    description: 'Ghi nhận hao hụt',
    level: 'Medium',
    sprint: '',
    status: ''
  }
];

// Supply Coordinator Functions (SC-00 to SC-10)
export const supplyCoordinatorFunctions: FunctionItem[] = [
  {
    id: 'SC-00',
    title: 'Login / Logout',
    description: 'Đăng nhập/Đăng xuất',
    level: 'Simple',
    sprint: '',
    status: ''
  },
  {
    id: 'SC-01',
    title: 'Dashboard',
    description: 'Tổng hợp đơn',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'SC-02',
    title: 'View All Store Orders',
    description: 'Xem toàn bộ đơn',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'SC-03',
    title: 'Aggregate Orders',
    description: 'Gộp đơn',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'SC-04',
    title: 'Prioritize Orders',
    description: 'Ưu tiên đơn',
    level: 'Complex',
    sprint: '',
    status: ''
  },
  {
    id: 'SC-05',
    title: 'Resolve Stock Issues',
    description: 'Xử lý thiếu hàng',
    level: 'Complex',
    sprint: '',
    status: ''
  },
  {
    id: 'SC-06',
    title: 'Reschedule Delivery',
    description: 'Điều chỉnh lịch giao',
    level: 'Complex',
    sprint: '',
    status: ''
  },
  {
    id: 'SC-07',
    title: 'Cancel / Adjust Orders',
    description: 'Điều chỉnh đơn',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'SC-08',
    title: 'Notify Stores & Kitchen',
    description: 'Gửi thông báo',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'SC-09',
    title: 'Delivery Monitoring',
    description: 'Theo dõi giao hàng',
    level: 'Medium',
    sprint: '',
    status: ''
  },
  {
    id: 'SC-10',
    title: 'Incident Report',
    description: 'Báo cáo sự cố',
    level: 'Medium',
    sprint: '',
    status: ''
  }
];

// Get functions by role
export const getFunctionsByRole = (role: Role): FunctionItem[] => {
  switch (role) {
    case 'Admin':
      return adminFunctions;
    case 'Manager':
      return managerFunctions;
    case 'Franchise Store Staff':
      return franchiseStoreStaffFunctions;
    case 'Central Kitchen Staff':
      return centralKitchenStaffFunctions;
    case 'Supply Coordinator':
      return supplyCoordinatorFunctions;
    default:
      return [];
  }
};

// Page permissions by role
export const pagePermissions: Record<Role, string[]> = {
  'Admin': ['home', 'dashboard', 'users', 'stores', 'recipes', 'inventory', 'production', 'orders'],
  'Manager': ['home', 'dashboard', 'recipes', 'inventory', 'production', 'orders', 'stores'],
  'Franchise Store Staff': ['home', 'dashboard', 'inventory', 'orders', 'recipes'],
  'Central Kitchen Staff': ['home', 'dashboard', 'production', 'inventory', 'orders', 'recipes'],
  'Supply Coordinator': ['home', 'dashboard', 'orders', 'inventory', 'stores']
};

// Check if user has access to a page
export const hasPageAccess = (role: Role, page: string): boolean => {
  return pagePermissions[role]?.includes(page) || false;
};

// Get accessible pages for a role
export const getAccessiblePages = (role: Role): string[] => {
  return pagePermissions[role] || [];
};
