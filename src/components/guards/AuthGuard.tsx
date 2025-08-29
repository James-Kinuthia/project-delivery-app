'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RBAC } from '@/lib/rbac';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Unauthorized component
const UnauthorizedMessage = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-4">You don't have permission to view this page.</p>
      <button
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Back
      </button>
    </div>
  </div>
);

// Basic Auth Guard - requires user to be logged in
interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const AuthGuard = ({ children, fallback }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return fallback || <div>Redirecting...</div>;
  }

  return <>{children}</>;
};

// Role Guard - requires specific role(s)
interface RoleGuardProps {
  children: ReactNode;
  roles: string | string[];
  fallback?: ReactNode;
  redirectTo?: string;
}

export const RoleGuard = ({ children, roles, fallback, redirectTo }: RoleGuardProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const roleArray = Array.isArray(roles) ? roles : [roles];
  const hasRequiredRole = RBAC.hasAnyRole(user, roleArray);

  useEffect(() => {
    if (!loading && user && !hasRequiredRole && redirectTo) {
      router.push(redirectTo);
    }
  }, [user, loading, hasRequiredRole, redirectTo, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  if (!hasRequiredRole) {
    return fallback || <UnauthorizedMessage />;
  }

  return <>{children}</>;
};

// Permission Guard - requires specific permission(s)
interface PermissionGuardProps {
  children: ReactNode;
  permissions: { resource: string; action: string } | Array<{ resource: string; action: string }>;
  requireAll?: boolean; // If true, requires ALL permissions; if false, requires ANY permission
  fallback?: ReactNode;
}

export const PermissionGuard = ({ 
  children, 
  permissions, 
  requireAll = false, 
  fallback 
}: PermissionGuardProps) => {
  const { user, loading } = useAuth();

  const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
  
  const hasPermission = requireAll
    ? permissionArray.every(({ resource, action }) => RBAC.hasPermission(user, resource, action))
    : permissionArray.some(({ resource, action }) => RBAC.hasPermission(user, resource, action));

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  if (!hasPermission) {
    return fallback || <UnauthorizedMessage />;
  }

  return <>{children}</>;
};

// Admin Guard - shorthand for admin role
interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const AdminGuard = ({ children, fallback }: AdminGuardProps) => (
  <RoleGuard roles="admin" fallback={fallback}>
    {children}
  </RoleGuard>
);

// Manager Guard - allows managers and admins
interface ManagerGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ManagerGuard = ({ children, fallback }: ManagerGuardProps) => (
  <RoleGuard roles={['manager', 'admin']} fallback={fallback}>
    {children}
  </RoleGuard>
);

// Conditional render based on auth status
interface ConditionalRenderProps {
  children: ReactNode;
  condition: 'authenticated' | 'unauthenticated' | 'loading';
}

export const ConditionalRender = ({ children, condition }: ConditionalRenderProps) => {
  const { user, loading } = useAuth();

  if (condition === 'loading' && loading) return <>{children}</>;
  if (condition === 'authenticated' && user) return <>{children}</>;
  if (condition === 'unauthenticated' && !user && !loading) return <>{children}</>;

  return null;
};