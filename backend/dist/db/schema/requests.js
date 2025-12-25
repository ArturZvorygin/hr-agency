"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requests = void 0;
// src/db/schema/requests.ts
const pg_core_1 = require("drizzle-orm/pg-core");
const users_1 = require("./users");
const companies_1 = require("./companies");
const staffCategories_1 = require("./staffCategories");
exports.requests = (0, pg_core_1.pgTable)("requests", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    // ВАЖНО: property = camelCase, а колонка в БД = snake_case
    companyId: (0, pg_core_1.uuid)("company_id")
        .notNull()
        .references(() => companies_1.companies.id),
    createdBy: (0, pg_core_1.uuid)("created_by")
        .notNull()
        .references(() => users_1.users.id),
    assignedManager: (0, pg_core_1.uuid)("assigned_manager").references(() => users_1.users.id),
    positionTitle: (0, pg_core_1.varchar)("position_title", { length: 255 }).notNull(),
    staffCategoryId: (0, pg_core_1.integer)("staff_category_id").references(() => staffCategories_1.staffCategories.id),
    experienceYears: (0, pg_core_1.numeric)("experience_years", { precision: 4, scale: 1 }),
    salaryFrom: (0, pg_core_1.numeric)("salary_from", { precision: 12, scale: 2 }),
    salaryTo: (0, pg_core_1.numeric)("salary_to", { precision: 12, scale: 2 }),
    currency: (0, pg_core_1.varchar)("currency", { length: 10 }).default("Руб"),
    description: (0, pg_core_1.text)("description"),
    keyRequirements: (0, pg_core_1.text)("key_requirements"),
    status: (0, pg_core_1.varchar)("status", { length: 30 }).notNull().default("NEW"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow()
});
