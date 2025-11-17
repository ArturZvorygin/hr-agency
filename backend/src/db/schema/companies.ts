// src/db/schema/companies.ts
import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp
} from "drizzle-orm/pg-core";

export const companies = pgTable("companies", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 50 }),
    website: varchar("website", { length: 255 }),
    description: text("description"),
    industry: varchar("industry", { length: 255 }),
    size: varchar("size", { length: 50 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});
