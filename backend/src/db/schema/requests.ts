// src/db/schema/requests.ts
import {
    pgTable,
    uuid,
    varchar,
    numeric,
    text,
    timestamp,
    integer
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { companies } from "./companies";
import { staffCategories } from "./staffCategories";

export const requests = pgTable("requests", {
    id: uuid("id").defaultRandom().primaryKey(),

    // ВАЖНО: property = camelCase, а колонка в БД = snake_case
    companyId: uuid("company_id")
        .notNull()
        .references(() => companies.id),

    createdBy: uuid("created_by")
        .notNull()
        .references(() => users.id),

    assignedManager: uuid("assigned_manager").references(() => users.id),

    positionTitle: varchar("position_title", { length: 255 }).notNull(),

    staffCategoryId: integer("staff_category_id").references(() => staffCategories.id),

    experienceYears: numeric("experience_years", { precision: 4, scale: 1 }),

    salaryFrom: numeric("salary_from", { precision: 12, scale: 2 }),
    salaryTo: numeric("salary_to", { precision: 12, scale: 2 }),
    currency: varchar("currency", { length: 10 }).default("KGS"),

    description: text("description"),
    keyRequirements: text("key_requirements"),

    status: varchar("status", { length: 30 }).notNull().default("new"),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});
