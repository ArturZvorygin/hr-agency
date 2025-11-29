// src/db/db.ts
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../config/env";

// Импорт схем
import * as usersSchema from "../db/schema/users";
import * as companiesSchema from "../db/schema/companies";
import * as staffCategoriesSchema from "../db/schema/staffCategories";
import * as servicesSchema from "../db/schema/services";
import * as requestsSchema from "../db/schema/requests";
import * as refreshTokensSchema from "../db/schema/tokens";

if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in .env");
}

const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // ВАЖНО для Neon

});

export const db = drizzle(pool, {
    schema: {
        ...usersSchema,
        ...companiesSchema,
        ...staffCategoriesSchema,
        ...servicesSchema,
        ...requestsSchema,
        ...refreshTokensSchema,
    }
});
