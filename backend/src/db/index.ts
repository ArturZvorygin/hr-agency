// src/db/index.ts
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../config/env";

import * as usersSchema from "./schema/users";
import * as companiesSchema from "./schema/companies";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export const db = drizzle(pool, {
    schema: {
        ...usersSchema,
        ...companiesSchema
    }
});

// Экспортируем pool, если вдруг понадобится raw-доступ
export { pool };
