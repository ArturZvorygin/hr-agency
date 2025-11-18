// src/db/schema/services.ts
import {
    pgTable,
    serial,
    varchar,
    text,
    numeric,
    boolean
} from "drizzle-orm/pg-core";

export const services = pgTable("services", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    basePrice: numeric("base_price", { precision: 12, scale: 2 }),
    isActive: boolean("is_active").notNull().default(true)
});
