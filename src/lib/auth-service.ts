import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '@/db/db';
import { users, userRoles, roles, permissions, rolePermissions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { User, AuthResponse, JWTPayload, LoginData, RegisterData } from '@/types/auth';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  static verifyToken(token: string): JWTPayload {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  }

  static async getUserWithRoles(userId: string): Promise<User | null> {
    const result = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        roleName: roles.name,
        roleId: roles.id,
        roleDescription: roles.description,
        permissionName: permissions.name,
        permissionResource: permissions.resource,
        permissionAction: permissions.action,
      })
      .from(users)
      .leftJoin(userRoles, eq(users.id, userRoles.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .leftJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
      .leftJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(and(eq(users.id, userId), eq(users.isActive, true)));

    if (!result.length) return null;

    const user: User = {
      id: result[0].id,
      email: result[0].email,
      firstName: result[0].firstName,
      lastName: result[0].lastName,
      isActive: result[0].isActive,
      createdAt: result[0].createdAt.toISOString(),
      updatedAt: result[0].updatedAt.toISOString(),
      roles: [],
      permissions: [],
    };

    // Group roles and permissions
    const roleMap = new Map();
    const permissionSet = new Set();

    result.forEach((row) => {
      if (row.roleName && !roleMap.has(row.roleId)) {
        roleMap.set(row.roleId, {
          id: row.roleId,
          name: row.roleName,
          description: row.roleDescription,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      if (row.permissionName && row.permissionResource && row.permissionAction) {
        const permissionKey = `${row.permissionResource}.${row.permissionAction}`;
        if (!permissionSet.has(permissionKey)) {
          permissionSet.add(permissionKey);
          user.permissions!.push({
            id: Math.random().toString(), // Will be replaced with actual permission ID
            name: row.permissionName,
            description: '',
            resource: row.permissionResource,
            action: row.permissionAction,
            createdAt: new Date().toISOString(),
          });
        }
      }
    });

    user.roles = Array.from(roleMap.values());
    return user;
  }

  static async login(data: LoginData): Promise<AuthResponse> {
    // Find user by email
    const userResult = await db
      .select()
      .from(users)
      .where(and(eq(users.email, data.email), eq(users.isActive, true)))
      .limit(1);

    if (!userResult.length) {
      throw new Error('Invalid credentials');
    }

    const user = userResult[0];

    // Verify password
    const isValidPassword = await this.comparePassword(data.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Get user with roles and permissions
    const userWithRoles = await this.getUserWithRoles(user.id);
    if (!userWithRoles) {
      throw new Error('User not found');
    }

    // Generate JWT token
    const tokenPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId: user.id,
      email: user.email,
      roles: userWithRoles.roles?.map(role => role.name) || [],
      permissions: userWithRoles.permissions?.map(p => ({
        resource: p.resource,
        action: p.action,
      })) || [],
    };

    const token = this.generateToken(tokenPayload);

    return {
      user: userWithRoles,
      token,
    };
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existingUser.length) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(data.password);

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
      })
      .returning();

    const createdUser = newUser[0];

    // Assign default 'user' role
    const userRole = await db
      .select()
      .from(roles)
      .where(eq(roles.name, 'user'))
      .limit(1);

    if (userRole.length) {
      await db.insert(userRoles).values({
        userId: createdUser.id,
        roleId: userRole[0].id,
      });
    }

    // Get user with roles
    const userWithRoles = await this.getUserWithRoles(createdUser.id);
    if (!userWithRoles) {
      throw new Error('Failed to create user');
    }

    // Generate token
    const tokenPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId: createdUser.id,
      email: createdUser.email,
      roles: userWithRoles.roles?.map(role => role.name) || [],
      permissions: userWithRoles.permissions?.map(p => ({
        resource: p.resource,
        action: p.action,
      })) || [],
    };

    const token = this.generateToken(tokenPayload);

    return {
      user: userWithRoles,
      token,
    };
  }

  static async getUserFromToken(token: string): Promise<User | null> {
    try {
      const payload = this.verifyToken(token);
      return await this.getUserWithRoles(payload.userId);
    } catch (error) {
      return null;
    }
  }
}