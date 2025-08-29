import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { users, roles, userRoles } from '@/db/schema';


const seedDatabase = async () => {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is not defined');
    }

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    console.log('🌱 Seeding database...');

    // Create roles
    const [adminRole, managerRole, userRole] = await db.insert(roles).values([
        { name: 'admin', description: 'System administrator' },
        { name: 'manager', description: 'Project manager' },
        { name: 'user', description: 'Regular user' },
    ]).returning();

    // Create demo users
    const password = await bcrypt.hash('password', 10);

    const [adminUser, managerUser, regularUser] = await db.insert(users).values([
        {
            email: 'admin@example.com',
            password,
            firstName: 'Admin',
            lastName: 'User',
        },
        {
            email: 'manager@example.com',
            password,
            firstName: 'Manager',
            lastName: 'User',
        },
        {
            email: 'user@example.com',
            password,
            firstName: 'Regular',
            lastName: 'User',
        },
    ]).returning();

    // Assign roles
    await db.insert(userRoles).values([
        { userId: adminUser.id, roleId: adminRole.id },
        { userId: managerUser.id, roleId: managerRole.id },
        { userId: regularUser.id, roleId: userRole.id },
    ]);

    console.log('✅ Seeding completed!');
    process.exit(0);
};

seedDatabase().catch((err) => {
    console.error('❌ Seeding failed!');
    console.error(err);
    process.exit(1);
});