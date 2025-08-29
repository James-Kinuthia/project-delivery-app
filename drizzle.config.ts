import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql", // Required: 'postgresql' | 'mysql' | 'sqlite' | 'turso' | 'singlestore' | 'gel'
    schema: "./src/db/schema.ts", // Path to your schema
    out: "./drizzle",             // Folder for migrations
    dbCredentials: {
        url: process.env.DATABASE_URL!, // Make sure DATABASE_URL is set in .env
    },
});
