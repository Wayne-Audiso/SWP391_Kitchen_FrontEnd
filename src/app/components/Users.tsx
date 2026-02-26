import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import {
  Users as UsersIcon,
  Shield,
  UserCog,
  Plus,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { usersApi, type UserApiModel } from "@/app/services/usersService";

interface NewUserForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

interface Role {
  id: string;
  roleName: string;
  permissions: string[];
}

const ROLES: Role[] = [
  {
    id: "1",
    roleName: "Admin",
    permissions: ["Full system access", "View reports", "Manage users"],
  },
  {
    id: "2",
    roleName: "Manager",
    permissions: ["Manage store", "Place orders", "View store reports"],
  },
  {
    id: "3",
    roleName: "Supply Coordinator",
    permissions: [
      "Manage inventory",
      "Distribute goods",
      "Coordinate shipments",
    ],
  },
  {
    id: "4",
    roleName: "Central Kitchen Staff",
    permissions: ["Manage production", "Quality control", "Recipe management"],
  },
  {
    id: "5",
    roleName: "Franchise Store Staff",
    permissions: ["Manage store inventory", "Process orders"],
  },
];

export function Users() {
  const [users, setUsers] = useState<UserApiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<NewUserForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (
      !newUser.username ||
      !newUser.email ||
      !newUser.password ||
      !newUser.role
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newUser.password !== newUser.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      await fetch(baseUrl + "/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: newUser.username,
          email: newUser.email,
          password: newUser.password,
          confirmPassword: newUser.confirmPassword,
          role: newUser.role,
        }),
      });
      toast.success("User created successfully");
      setIsCreateDialogOpen(false);
      setNewUser({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
      loadUsers();
    } catch {
      toast.error("Failed to create user");
    }
  };

  const handleDelete = async (id: string, userName: string) => {
    try {
      await usersApi.delete(id);
      setUsers((prev: UserApiModel[]) =>
        prev.filter((u: UserApiModel) => u.id !== id),
      );
      toast.success("Deleted user: " + userName);
    } catch {
      // error handled by interceptor
    }
  };

  const getRoleBadge = (role: string) => {
    const colorMap: Record<string, string> = {
      Admin: "bg-red-100 text-red-700",
      Manager: "bg-blue-100 text-blue-700",
      "Supply Coordinator": "bg-purple-100 text-purple-700",
      "Central Kitchen Staff": "bg-green-100 text-green-700",
      "Franchise Store Staff": "bg-yellow-100 text-yellow-700",
    };
    return (
      <Badge className={colorMap[role] || "bg-gray-100 text-gray-700"}>
        {role}
      </Badge>
    );
  };

  const getInitials = (name: string) =>
    name
      .split(/[\\s_.-]/)
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const rolesWithCount = ROLES.map((r) => ({
    ...r,
    userCount: users.filter((u: UserApiModel) => u.role === r.roleName).length,
  }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
        <p className="text-gray-600 mt-2">Manage accounts and permissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Users
            </CardTitle>
            <UsersIcon className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-gray-600 mt-1">Accounts in system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Roles
            </CardTitle>
            <Shield className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {ROLES.length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Different roles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Admins
            </CardTitle>
            <Shield className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {users.filter((u: UserApiModel) => u.role === "Admin").length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Admin accounts</p>
          </CardContent>
        </Card>
      </div>

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
                <Dialog
                  open={isCreateDialogOpen}
                  onOpenChange={setIsCreateDialogOpen}
                >
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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNewUser({ ...newUser, username: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          placeholder="Enter email"
                          value={newUser.email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNewUser({ ...newUser, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Password</Label>
                        <Input
                          type="password"
                          placeholder="Enter password"
                          value={newUser.password}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNewUser({ ...newUser, password: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Confirm Password</Label>
                        <Input
                          type="password"
                          placeholder="Confirm password"
                          value={newUser.confirmPassword}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNewUser({
                              ...newUser,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Select
                          value={newUser.role}
                          onValueChange={(v: string) =>
                            setNewUser({ ...newUser, role: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES.map((r) => (
                              <SelectItem key={r.id} value={r.roleName}>
                                {r.roleName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateUser}>Create User</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12 text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  Loading users...
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  No users found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user: UserApiModel) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-blue-600 text-white">
                                {getInitials(user.userName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.userName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {user.userName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:border-red-300"
                            onClick={() => handleDelete(user.id, user.userName)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {rolesWithCount.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-purple-600" />
                      </div>
                      <CardTitle className="text-lg">{role.roleName}</CardTitle>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">
                      {role.userCount} {role.userCount === 1 ? "user" : "users"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <UserCog className="w-4 h-4" />
                    Permissions:
                  </p>
                  <ul className="space-y-2">
                    {role.permissions.map((permission: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <span className="text-green-600 mt-1">✓</span>
                        <span>{permission}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
