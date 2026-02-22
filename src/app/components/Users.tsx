import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Users as UsersIcon, Shield, UserCog, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  userId: string;
  username: string;
  realName: string;
  role: string;
  status: 'active' | 'inactive';
  email: string;
  location: string;
  password: string;
}

interface Role {
  id: string;
  roleId: string;
  roleName: string;
  userCount: number;
  permissions: string[];
}

const initialUsers: User[] = [
  { id: '1', userId: 'USR-001', username: 'admin', realName: 'Admin User', role: 'Admin', status: 'active', email: 'admin@franchise.com', location: 'Central Kitchen', password: 'admin' },
  { id: '2', userId: 'USR-002', username: 'manager_d1', realName: 'John Smith', role: 'Manager', status: 'active', email: 'd1@franchise.com', location: 'District 1 Store', password: 'manager_d1' },
  { id: '3', userId: 'USR-003', username: 'manager_d2', realName: 'Sarah Johnson', role: 'Manager', status: 'active', email: 'd2@franchise.com', location: 'District 2 Store', password: 'manager_d2' },
  { id: '4', userId: 'USR-004', username: 'supply_coord', realName: 'Michael Chen', role: 'Supply Coordinator', status: 'active', email: 'supply@franchise.com', location: 'Central Kitchen', password: 'supply_coord' },
  { id: '5', userId: 'USR-005', username: 'kitchen_staff', realName: 'Emily Wong', role: 'Central Kitchen Staff', status: 'active', email: 'kitchen1@franchise.com', location: 'Central Kitchen', password: 'kitchen_staff' },
  { id: '6', userId: 'USR-010', username: 'staff_old', realName: 'David Lee', role: 'Franchise Store Staff', status: 'inactive', email: 'old@franchise.com', location: 'District 10 Store', password: 'staff_old' },
];

const initialRoles: Role[] = [
  { id: '1', roleId: 'ROLE-001', roleName: 'Admin', userCount: 1, permissions: ['Full system access', 'View reports', 'Manage users'] },
  { id: '2', roleId: 'ROLE-002', roleName: 'Manager', userCount: 2, permissions: ['Manage store', 'Place orders', 'View store reports'] },
  { id: '3', roleId: 'ROLE-003', roleName: 'Supply Coordinator', userCount: 1, permissions: ['Manage inventory', 'Distribute goods', 'Coordinate shipments'] },
  { id: '4', roleId: 'ROLE-004', roleName: 'Central Kitchen Staff', userCount: 1, permissions: ['Manage production', 'Quality control', 'Recipe management'] },
  { id: '5', roleId: 'ROLE-005', roleName: 'Franchise Store Staff', userCount: 1, permissions: ['Manage store inventory', 'Process orders'] },
];

// Sync function to update localStorage for LoginPage
const syncToLoginSystem = (users: User[]) => {
  // Convert to LoginPage format
  const loginUsers = users.map(u => ({
    id: u.id,
    username: u.username,
    name: u.realName,
    role: u.role,
    email: u.email,
    storeId: u.location.includes('Store') ? `ST-${u.id.padStart(3, '0')}` : undefined,
    storeName: u.location.includes('Store') ? u.location : undefined
  }));

  // Create password mapping
  const passwordMapping: Record<string, string> = {};
  users.forEach(u => {
    passwordMapping[u.username] = u.password;
  });

  // Update localStorage
  localStorage.setItem('systemUsers', JSON.stringify(loginUsers));
  localStorage.setItem('systemPasswords', JSON.stringify(passwordMapping));
  
  console.log('✅ Synced to login system:', loginUsers.length, 'users');
};

export function Users() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [roles] = useState<Role[]>(initialRoles);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const [newUser, setNewUser] = useState({
    username: '',
    realName: '',
    email: '',
    role: '',
    location: '',
  });

  // Sync to login system on mount and when users change
  useEffect(() => {
    syncToLoginSystem(users);
  }, [users]);

  const handleCreateUser = () => {
    if (!newUser.username || !newUser.realName || !newUser.email || !newUser.role || !newUser.location) {
      toast.error('Please fill in all fields');
      return;
    }

    const user: User = {
      id: String(users.length + 1),
      userId: `USR-${String(users.length + 1).padStart(3, '0')}`,
      username: newUser.username,
      realName: newUser.realName,
      role: newUser.role,
      status: 'active',
      email: newUser.email,
      location: newUser.location,
      password: 'new_user_123',
    };

    setUsers([...users, user]);
    setIsCreateDialogOpen(false);
    setNewUser({ username: '', realName: '', email: '', role: '', location: '' });
    toast.success('User created successfully!');
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'inactive' as const : 'active' as const }
        : u
    ));
    toast.success('User status updated');
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-700">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const colorMap: Record<string, string> = {
      'Admin': 'bg-red-100 text-red-700',
      'Manager': 'bg-blue-100 text-blue-700',
      'Supply Coordinator': 'bg-purple-100 text-purple-700',
      'Central Kitchen Staff': 'bg-green-100 text-green-700',
      'Franchise Store Staff': 'bg-yellow-100 text-yellow-700',
    };
    return <Badge className={colorMap[role] || 'bg-gray-100 text-gray-700'}>{role}</Badge>;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const activeUsers = users.filter(u => u.status === 'active').length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
        <p className="text-gray-600 mt-2">Manage accounts and permissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            <UsersIcon className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-gray-600 mt-1">Accounts in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
            <UsersIcon className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
            <p className="text-xs text-gray-600 mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Roles</CardTitle>
            <Shield className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{roles.length}</div>
            <p className="text-xs text-gray-600 mt-1">Different roles</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5" />
                  User List
                </CardTitle>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Username</Label>
                        <Input
                          placeholder="Enter username"
                          value={newUser.username}
                          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input
                          placeholder="Enter full name"
                          value={newUser.realName}
                          onChange={(e) => setNewUser({ ...newUser, realName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          placeholder="Enter email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Manager">Manager</SelectItem>
                            <SelectItem value="Supply Coordinator">Supply Coordinator</SelectItem>
                            <SelectItem value="Central Kitchen Staff">Central Kitchen Staff</SelectItem>
                            <SelectItem value="Franchise Store Staff">Franchise Store Staff</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          placeholder="Enter location"
                          value={newUser.location}
                          onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateUser}>
                        Create User
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-blue-600 text-white">
                              {getInitials(user.realName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.realName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{user.userId}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell><span className="font-mono text-gray-500">{user.password}</span></TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{user.location}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button 
                            variant={user.status === 'active' ? 'outline' : 'default'}
                            size="sm"
                            onClick={() => handleToggleUserStatus(user.id)}
                          >
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{role.roleName}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">{role.roleId}</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">
                      {role.userCount} users
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <UserCog className="w-4 h-4" />
                      Permissions:
                    </p>
                    <ul className="space-y-2">
                      {role.permissions.map((permission, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1" size="sm">
                      Edit Permissions
                    </Button>
                    <Button variant="outline" className="flex-1" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}