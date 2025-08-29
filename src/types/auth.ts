export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roles?: Role[];
  permissions?: Permission[];
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  permissions?: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  hasRole: (roleName: string) => boolean;
  hasPermission: (resource: string, action: string) => boolean;
  hasAnyRole: (roleNames: string[]) => boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  roles: string[];
  permissions: Array<{
    resource: string;
    action: string;
  }>;
  iat: number;
  exp: number;
}

// Role constants
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

// Permission constants
export const PERMISSIONS = {
  // User management
  USER_CREATE: 'user.create',
  USER_READ: 'user.read',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  
  // Role management
  ROLE_CREATE: 'role.create',
  ROLE_READ: 'role.read',
  ROLE_UPDATE: 'role.update',
  ROLE_DELETE: 'role.delete',
  
  // Analytics
  ANALYTICS_READ: 'analytics.read',
  ANALYTICS_CREATE: 'analytics.create',
  
  // Posts
  POST_CREATE: 'post.create',
  POST_READ: 'post.read',
  POST_UPDATE: 'post.update',
  POST_DELETE: 'post.delete',
  POST_PUBLISH: 'post.publish',
  
  // Departments
  DEPARTMENT_READ: 'department.read',
  DEPARTMENT_MANAGE: 'department.manage',
} as const;

export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];