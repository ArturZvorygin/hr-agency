// src/db/schema/users.ts
import {
    pgTable,
    uuid,
    varchar,
    boolean,
    timestamp
} from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { sql } from "drizzle-orm";

export type UserRole = "client" | "manager" | "admin";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    role: varchar("role", { length: 20 }).notNull(), // 'client' | 'manager' | 'admin'

    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    phone: varchar("phone", { length: 50 }),

    companyId: uuid("company_id").references(() => companies.id),

    isActive: boolean("is_active").default(true),

    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull()
        .default(sql`now()`)
});
