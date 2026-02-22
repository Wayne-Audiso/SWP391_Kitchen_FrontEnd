import { useState, useEffect } from 'react';
import { LoginPage, User } from '@/app/components/LoginPage';
import { HomePage } from '@/app/components/HomePage';
import { Dashboard } from '@/app/components/Dashboard';
import { Production } from '@/app/components/Production';
import { Inventory } from '@/app/components/Inventory';
import { Orders } from '@/app/components/Orders';
import { Recipes } from '@/app/components/Recipes';
import { Stores } from '@/app/components/Stores';
import { Users } from '@/app/components/Users';
import { Sidebar } from '@/app/components/Sidebar';
import { Toaster } from '@/app/components/ui/sonner';
import { toast } from 'sonner';

export type Page = 'home' | 'dashboard' | 'production' | 'inventory' | 'orders' | 'recipes' | 'stores' | 'users';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
    toast.success(`Welcome back, ${loggedInUser.name}!`, {
      description: `Logged in as ${loggedInUser.role}`,
    });
  };

  const handleLogout = () => {
    const userName = user?.name;
    setUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('home');
    toast.info(`Goodbye, ${userName}!`, {
      description: 'You have been logged out successfully',
    });
  };

  // Show loading state while checking for stored session
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if user is not logged in
  if (!user) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'dashboard':
        return <Dashboard />;
      case 'production':
        return <Production />;
      case 'inventory':
        return <Inventory />;
      case 'orders':
        return <Orders />;
      case 'recipes':
        return <Recipes />;
      case 'stores':
        return <Stores />;
      case 'users':
        return <Users />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
      <Toaster />
    </div>
  );
}