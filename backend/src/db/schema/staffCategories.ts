// src/db/schema/staffCategories.ts
import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";

export const staffCategories = pgTable("staff_categories", {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description")
});
