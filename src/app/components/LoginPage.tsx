import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Store, Lock, User as UserIcon, AlertCircle, ArrowLeft, Mail, Building, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/app/components/ui/alert';

export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  email: string;
  storeId?: string;
  storeName?: string;
}

// Default mock users for initial setup
const defaultMockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    name: 'Admin User',
    role: 'Admin',
    email: 'admin@centralkitchen.com'
  },
  {
    id: '2',
    username: 'manager_d1',
    name: 'John Smith',
    role: 'Manager',
    email: 'john.smith@centralkitchen.com'
  },
  {
    id: '3',
    username: 'kitchen_staff',
    name: 'Emily Wong',
    role: 'Central Kitchen Staff',
    email: 'emily.wong@centralkitchen.com'
  },
  {
    id: '4',
    username: 'supply_coord',
    name: 'Michael Chen',
    role: 'Supply Coordinator',
    email: 'michael.chen@centralkitchen.com'
  },
  {
    id: '5',
    username: 'staff_old',
    name: 'David Lee',
    role: 'Franchise Store Staff',
    email: 'david.lee@district10store.com',
    storeId: 'ST-010',
    storeName: 'District 10 Store'
  }
];

// Default password mapping for each user
const defaultUserPasswords: Record<string, string> = {
  'admin': 'admin',
  'manager_d1': 'manager_d1',
  'kitchen_staff': 'kitchen_staff',
  'supply_coord': 'supply_coord',
  'staff_old': 'staff_old'
};

// Initialize users from localStorage or use defaults
const initializeUsers = (): User[] => {
  try {
    const stored = localStorage.getItem('systemUsers');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading users from localStorage:', error);
  }
  return defaultMockUsers;
};

// Initialize passwords from localStorage or use defaults
const initializePasswords = (): Record<string, string> => {
  try {
    const stored = localStorage.getItem('systemPasswords');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading passwords from localStorage:', error);
  }
  return defaultUserPasswords;
};

interface LoginPageProps {
  onLogin: (user: User) => void;
}

type LoginView = 'default' | 'quick_login_auth' | 'register';

export function LoginPage({ onLogin }: LoginPageProps) {
  const [view, setView] = useState<LoginView>('default');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic user management
  const [mockUsers, setMockUsers] = useState<User[]>(initializeUsers);
  const [userPasswords, setUserPasswords] = useState<Record<string, string>>(initializePasswords);

  // Registration State
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('Franchise Store Staff');

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // Find user by username
      const user = mockUsers.find(u => u.username === username);

      if (!user) {
        setError('Invalid username or password');
        setIsLoading(false);
        return;
      }

      // Check password using userPasswords mapping
      const correctPassword = userPasswords[user.username];
      if (password !== correctPassword) {
        setError(`Invalid password. (Hint: ${correctPassword})`);
        setIsLoading(false);
        return;
      }

      // Success - login
      onLogin(user);
      setIsLoading(false);
    }, 800);
  };

  const handleQuickLoginClick = (user: User) => {
    setSelectedUser(user);
    setUsername(user.username);
    setPassword(''); // Clear password
    setError('');
    setView('quick_login_auth');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!regName || !regUsername || !regPassword) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    // Block Admin registration
    if (regRole === 'Admin') {
      setError('Cannot create Admin accounts. Only one Admin is allowed in the system.');
      setIsLoading(false);
      return;
    }

    // Check if username already exists
    if (mockUsers.find(u => u.username === regUsername)) {
      setError('Username already exists. Please choose a different username.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      // Create new user
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        username: regUsername,
        name: regName,
        email: regEmail,
        role: regRole,
        storeName: regRole === 'Franchise Store Staff' ? 'New Store' : undefined
      };
      
      // Add to users list
      const updatedUsers = [...mockUsers, newUser];
      setMockUsers(updatedUsers);
      localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));

      // Add password
      const updatedPasswords = { ...userPasswords, [regUsername]: regPassword };
      setUserPasswords(updatedPasswords);
      localStorage.setItem('systemPasswords', JSON.stringify(updatedPasswords));

      // Login the new user
      onLogin(newUser);
      setIsLoading(false);
    }, 1000);
  };

  const renderDefaultLogin = () => (
    <div className="space-y-6">
       <div className="space-y-1 pb-2">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 h-4 w-4 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or quick login as</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {mockUsers.map((user) => (
          <Button
            key={user.id}
            variant="outline"
            size="sm"
            onClick={() => handleQuickLoginClick(user)}
            disabled={isLoading}
            className={`text-xs h-auto py-2 flex flex-col items-center gap-1 ${
              user.role === 'Franchise Store Staff' ? 'col-span-2' : ''
            }`}
          >
            <span className="font-semibold">{user.role}</span>
            <span className="text-[10px] text-gray-500 font-normal">({user.username})</span>
          </Button>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => {
              setView('register');
              setError('');
            }}
            className="text-blue-600 hover:underline font-medium"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );

  const renderQuickLoginAuth = () => (
    <div className="space-y-6">
      <div className="pb-2">
         <Button 
            variant="ghost" 
            size="sm" 
            className="mb-2 -ml-2 text-gray-500" 
            onClick={() => {
               setView('default');
               setPassword('');
               setError('');
            }}
         >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to options
         </Button>
         <CardTitle className="text-xl">Login as {selectedUser?.role}</CardTitle>
         <CardDescription>
            Enter password for <strong>{selectedUser?.name}</strong>
         </CardDescription>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username_static">Username</Label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="username_static"
              value={username}
              className="pl-10 bg-gray-100"
              readOnly
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password_auth">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password_auth"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              autoFocus
              required
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Login'}
        </Button>
      </form>
    </div>
  );

  const renderRegister = () => (
    <div className="space-y-6">
      <div className="pb-2">
         <Button 
            variant="ghost" 
            size="sm" 
            className="mb-2 -ml-2 text-gray-500" 
            onClick={() => {
               setView('default');
               setError('');
            }}
         >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
         </Button>
         <CardTitle className="text-xl">Create Account</CardTitle>
         <CardDescription>
            Register a new user in the system
         </CardDescription>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
            <Label htmlFor="reg_name">Full Name</Label>
            <Input
                id="reg_name"
                placeholder="John Doe"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
            />
            </div>
            <div className="space-y-2">
            <Label htmlFor="reg_username">Username</Label>
            <Input
                id="reg_username"
                placeholder="johndoe"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
            />
            </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg_email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="reg_email"
              type="email"
              placeholder="john@example.com"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg_password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="reg_password"
              type={showRegPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              className="pl-10"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 h-4 w-4 text-gray-400"
              onClick={() => setShowRegPassword(!showRegPassword)}
            >
              {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg_role">Role</Label>
          <Select value={regRole} onValueChange={setRegRole}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Franchise Store Staff">Franchise Store Staff</SelectItem>
              <SelectItem value="Central Kitchen Staff">Central Kitchen Staff</SelectItem>
              <SelectItem value="Supply Coordinator">Supply Coordinator</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">Note: Admin accounts cannot be created through registration</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Register'}
        </Button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden md:block space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Store className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Central Kitchen</h1>
              <p className="text-gray-600">Franchise Management System</p>
            </div>
          </div>
          
          <div className="space-y-4 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">System Features</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-gray-900">Production Management</p>
                  <p className="text-sm text-gray-600">Plan and track production batches</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-gray-900">Inventory Control</p>
                  <p className="text-sm text-gray-600">Real-time inventory tracking</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-gray-900">Order Management</p>
                  <p className="text-sm text-gray-600">Streamlined ordering process</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-gray-900">Store Operations</p>
                  <p className="text-sm text-gray-600">Manage franchise stores efficiently</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Right side - Login Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-0">
             <div className="md:hidden flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Central Kitchen</h1>
                <p className="text-sm text-gray-600">Franchise Management</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {view === 'default' && renderDefaultLogin()}
            {view === 'quick_login_auth' && renderQuickLoginAuth()}
            {view === 'register' && renderRegister()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}