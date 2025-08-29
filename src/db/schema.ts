import { pgTable, text, timestamp, uuid, boolean, integer, primaryKey, serial, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  projectName: varchar('project_name', { length: 256 }).notNull(),
  contractorName: varchar('contractor_name', { length: 256 }).notNull(),
  contractorCompany: varchar('contractor_company', { length: 256 }),
  ward: varchar('ward', { length: 256 }),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  imageUrl: text('image_url'),
  completion: integer('completion').default(0), // Added for dashboard integration
  status: varchar('status', { length: 50 }).default('pending'), // Added for dashboard integration
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Roles table
export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').unique().notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Permissions table
export const permissions = pgTable('permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').unique().notNull(),
  description: text('description'),
  resource: text('resource').notNull(), // e.g., 'users', 'posts', 'analytics'
  action: text('action').notNull(), // e.g., 'create', 'read', 'update', 'delete'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User-Role junction table (many-to-many)
export const userRoles = pgTable('user_roles', {
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  roleId: uuid('role_id').references(() => roles.id, { onDelete: 'cascade' }).notNull(),
  assignedAt: timestamp('assigned_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.roleId] })
}));

// Role-Permission junction table (many-to-many)
export const rolePermissions = pgTable('role_permissions', {
  roleId: uuid('role_id').references(() => roles.id, { onDelete: 'cascade' }).notNull(),
  permissionId: uuid('permission_id').references(() => permissions.id, { onDelete: 'cascade' }).notNull(),
  grantedAt: timestamp('granted_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.roleId, table.permissionId] })
}));

// Sample data tables for role-based content
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: uuid('author_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
  departmentId: uuid('department_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const departments = pgTable('departments', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').unique().notNull(),
  description: text('description'),
  managerId: uuid('manager_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const analytics = pgTable('analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  metric: text('metric').notNull(),
  value: integer('value').notNull(),
  departmentId: uuid('department_id').references(() => departments.id),
  userId: uuid('user_id').references(() => users.id),
  date: timestamp('date').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userRoles: many(userRoles),
  posts: many(posts),
  managedDepartments: many(departments, { relationName: 'manager' }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  manager: one(users, {
    fields: [departments.managerId],
    references: [users.id],
  }),
  analytics: many(analytics),
}));

export const analyticsRelations = relations(analytics, ({ one }) => ({
  department: one(departments, {
    fields: [analytics.departmentId],
    references: [departments.id],
  }),
  user: one(users, {
    fields: [analytics.userId],
    references: [users.id],
  }),
}));