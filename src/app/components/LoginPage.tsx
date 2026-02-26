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

interface LoginPageProps {
  onLogin: (user: User, token: string) => void;
}

type LoginView = "default" | "register";

export function LoginPage({ onLogin }: LoginPageProps) {
  const [view, setView] = useState<LoginView>("default");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Registration State
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authApi.login({ username, password });

      const user: User = {
        id: response.userId,
        username: response.username,
        name: response.username,
        role: response.role,
        email: response.email,
      };

      onLogin(user, response.token);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Tên đăng nhập hoặc mật khẩu không đúng.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!regUsername || !regEmail || !regPassword || !regConfirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      setIsLoading(false);
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      setIsLoading(false);
      return;
    }

    try {
      await authApi.register({
        userName: regUsername,
        email: regEmail,
        password: regPassword,
        confirmPassword: regConfirmPassword,
      });

      // Tự động đăng nhập sau khi đăng ký
      const loginResponse = await authApi.login({
        username: regUsername,
        password: regPassword,
      });

      const user: User = {
        id: loginResponse.userId,
        username: loginResponse.username,
        name: loginResponse.username,
        role: loginResponse.role,
        email: loginResponse.email,
      };

      onLogin(user, loginResponse.token);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDefaultLogin = () => (
    <div className="space-y-6">
      <div className="space-y-1 pb-2">
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
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
              type={showPassword ? "text" : "password"}
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
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
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
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => {
              setView("register");
              setError("");
            }}
            className="text-blue-600 hover:underline font-medium"
          >
            Create Account
          </button>
        </p>
      </div>
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
            setView("default");
            setError("");
          }}
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to login
        </Button>
        <CardTitle className="text-xl">Create Account</CardTitle>
        <CardDescription>Register a new account</CardDescription>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reg_username">Username</Label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="reg_username"
              placeholder="johndoe"
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
              className="pl-10"
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
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg_password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="reg_password"
              type={showRegPassword ? "text" : "password"}
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
              {showRegPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reg_confirm_password">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="reg_confirm_password"
              type="password"
              placeholder="Confirm your password"
              value={regConfirmPassword}
              onChange={(e) => setRegConfirmPassword(e.target.value)}
              className="pl-10"
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
          {isLoading ? "Creating Account..." : "Register"}
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
              <h1 className="text-3xl font-bold text-gray-900">
                Central Kitchen
              </h1>
              <p className="text-gray-600">Franchise Management System</p>
            </div>
          </div>

          <div className="space-y-4 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              System Features
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-gray-900">
                    Production Management
                  </p>
                  <p className="text-sm text-gray-600">
                    Plan and track production batches
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-gray-900">Inventory Control</p>
                  <p className="text-sm text-gray-600">
                    Real-time inventory tracking
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-gray-900">Order Management</p>
                  <p className="text-sm text-gray-600">
                    Streamlined ordering process
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-gray-900">Store Operations</p>
                  <p className="text-sm text-gray-600">
                    Manage franchise stores efficiently
                  </p>
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
                <h1 className="text-xl font-bold text-gray-900">
                  Central Kitchen
                </h1>
                <p className="text-sm text-gray-600">Franchise Management</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {view === "default" && renderDefaultLogin()}
            {view === "register" && renderRegister()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
