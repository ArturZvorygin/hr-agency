"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companies = void 0;
// src/db/schema/companies.ts
const pg_core_1 = require("drizzle-orm/pg-core");
exports.companies = (0, pg_core_1.pgTable)("companies", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }),
    phone: (0, pg_core_1.varchar)("phone", { length: 50 }),
    website: (0, pg_core_1.varchar)("website", { length: 255 }),
    description: (0, pg_core_1.text)("description"),
    industry: (0, pg_core_1.varchar)("industry", { length: 255 }),
    size: (0, pg_core_1.varchar)("size", { length: 50 }),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow()
});
