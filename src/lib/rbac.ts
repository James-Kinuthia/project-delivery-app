import { User, Permission, ROLES, PERMISSIONS } from '@/types/auth';

export class RBAC {
  static hasRole(user: User | null, roleName: string): boolean {
    if (!user || !user.roles) return false;
    return user.roles.some(role => role.name === roleName);
  }

  static hasAnyRole(user: User | null, roleNames: string[]): boolean {
    if (!user || !user.roles) return false;
    return roleNames.some(roleName => 
      user.roles!.some(role => role.name === roleName)
    );
  }

  static hasPermission(user: User | null, resource: string, action: string): boolean {
    if (!user || !user.permissions) return false;
    return user.permissions.some(
      permission => permission.resource === resource && permission.action === action
    );
  }

  static hasAnyPermission(user: User | null, permissions: Array<{ resource: string; action: string }>): boolean {
    if (!user || !user.permissions) return false;
    return permissions.some(({ resource, action }) => 
      this.hasPermission(user, resource, action)
    );
  }

  static isAdmin(user: User | null): boolean {
    return this.hasRole(user, ROLES.ADMIN);
  }

  static isManager(user: User | null): boolean {
    return this.hasRole(user, ROLES.MANAGER);
  }

  static isUser(user: User | null): boolean {
    return this.hasRole(user, ROLES.USER);
  }

  static canManageUsers(user: User | null): boolean {
    return this.hasPermission(user, 'user', 'create') || 
           this.hasPermission(user, 'user', 'update') ||
           this.hasPermission(user, 'user', 'delete');
  }

  static canManageRoles(user: User | null): boolean {
    return this.hasPermission(user, 'role', 'create') || 
           this.hasPermission(user, 'role', 'update') ||
           this.hasPermission(user, 'role', 'delete');
  }

  static canViewAnalytics(user: User | null): boolean {
    return this.hasPermission(user, 'analytics', 'read');
  }

  static canManagePosts(user: User | null): boolean {
    return this.hasPermission(user, 'post', 'create') ||
           this.hasPermission(user, 'post', 'update') ||
           this.hasPermission(user, 'post', 'publish');
  }

  static canManageDepartments(user: User | null): boolean {
    return this.hasPermission(user, 'department', 'manage');
  }

  static getAccessibleRoutes(user: User | null): string[] {
    if (!user) return ['/login', '/register'];

    const routes = ['/dashboard', '/profile'];

    if (this.isAdmin(user)) {
      routes.push('/admin', '/admin/users', '/admin/roles');
    }

    if (this.isManager(user) || this.isAdmin(user)) {
      routes.push('/analytics', '/departments');
    }

    return routes;
  }

  static getUserDisplayName(user: User | null): string {
    if (!user) return 'Guest';
    return `${user.firstName} ${user.lastName}`;
  }

  static getHighestRole(user: User | null): string {
    if (!user || !user.roles) return 'guest';

    const roleHierarchy = [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER];
    
    for (const role of roleHierarchy) {
      if (this.hasRole(user, role)) {
        return role;
      }
    }

    return 'user';
  }

  static filterDataByRole<T extends Record<string, any>>(
    user: User | null,
    data: T[],
    filterField: keyof T
  ): T[] {
    if (!user) return [];

    // Admins see everything
    if (this.isAdmin(user)) {
      return data;
    }

    // Managers see their department data
    if (this.isManager(user)) {
      // In a real implementation, you'd filter by user's department
      // For now, return all data for managers
      return data;
    }

    // Regular users see only their own data
    return data.filter(item => item[filterField] === user.id);
  }
}

// Helper functions for common role checks
export const useRoleGuard = (user: User | null) => ({
  isAdmin: () => RBAC.isAdmin(user),
  isManager: () => RBAC.isManager(user),
  isUser: () => RBAC.isUser(user),
  hasRole: (role: string) => RBAC.hasRole(user, role),
  hasPermission: (resource: string, action: string) => RBAC.hasPermission(user, resource, action),
  canManageUsers: () => RBAC.canManageUsers(user),
  canManageRoles: () => RBAC.canManageRoles(user),
  canViewAnalytics: () => RBAC.canViewAnalytics(user),
});

// Predefined role configurations
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    { resource: 'user', action: 'create' },
    { resource: 'user', action: 'read' },
    { resource: 'user', action: 'update' },
    { resource: 'user', action: 'delete' },
    { resource: 'role', action: 'create' },
    { resource: 'role', action: 'read' },
    { resource: 'role', action: 'update' },
    { resource: 'role', action: 'delete' },
    { resource: 'analytics', action: 'read' },
    { resource: 'analytics', action: 'create' },
    { resource: 'post', action: 'create' },
    { resource: 'post', action: 'read' },
    { resource: 'post', action: 'update' },
    { resource: 'post', action: 'delete' },
    { resource: 'post', action: 'publish' },
    { resource: 'department', action: 'read' },
    { resource: 'department', action: 'manage' },
  ],
  [ROLES.MANAGER]: [
    { resource: 'user', action: 'read' },
    { resource: 'analytics', action: 'read' },
    { resource: 'post', action: 'create' },
    { resource: 'post', action: 'read' },
    { resource: 'post', action: 'update' },
    { resource: 'post', action: 'publish' },
    { resource: 'department', action: 'read' },
  ],
  [ROLES.USER]: [
    { resource: 'post', action: 'create' },
    { resource: 'post', action: 'read' },
    { resource: 'post', action: 'update' },
  ],
};