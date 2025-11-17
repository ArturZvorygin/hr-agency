// src/db.ts
import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

// схемы — пути под тебя, но в твоём случае так:
import * as usersSchema from "./users";
import * as companiesSchema from "./companies";
import * as requestsSchema from "./requests";
import * as staffCategoriesSchema from "./staffCategories";



// если есть другие схемы (tokens, requests и т.п.) — добавишь сюда же

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("❌ DATABASE_URL is not set in .env");
    throw new Error("DATABASE_URL is not set");
}

console.log("✅ Using DATABASE_URL:", connectionString);

const pool = new Pool({
    connectionString
});

export const db = drizzle(pool, {
    schema: {
        ...usersSchema,
        ...companiesSchema,
        ...staffCategoriesSchema,
        ...requestsSchema

    }
});
