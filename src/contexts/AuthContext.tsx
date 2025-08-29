"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/'];

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Initial auth check loading
  const [loading, setLoading] = useState(false); // Action loading (login/logout)
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication status on mount and get current user
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include', // Include cookies for session-based auth
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Redirect logic based on auth state
  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

      if (!user && !isPublicRoute) {
        // User is not authenticated and trying to access protected route
        router.push('/login');
      } else if (user && isPublicRoute && pathname !== '/') {
        // User is authenticated and on a public route (except home)
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      setUser(data.user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state even if API call fails
      setUser(null);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const value = {
    user,
    isLoading,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}