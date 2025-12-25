"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
// src/db/schema/users.ts
const pg_core_1 = require("drizzle-orm/pg-core");
const companies_1 = require("./companies");
const drizzle_orm_1 = require("drizzle-orm");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    passwordHash: (0, pg_core_1.varchar)("password_hash", { length: 255 }).notNull(),
    role: (0, pg_core_1.varchar)("role", { length: 20 }).notNull(), // 'client' | 'manager' | 'admin'
    firstName: (0, pg_core_1.varchar)("first_name", { length: 100 }),
    lastName: (0, pg_core_1.varchar)("last_name", { length: 100 }),
    phone: (0, pg_core_1.varchar)("phone", { length: 50 }),
    companyId: (0, pg_core_1.uuid)("company_id").references(() => companies_1.companies.id),
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull()
        .default((0, drizzle_orm_1.sql) `now()`)
});
