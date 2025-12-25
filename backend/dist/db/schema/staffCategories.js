"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffCategories = void 0;
// src/db/schema/staffCategories.ts
const pg_core_1 = require("drizzle-orm/pg-core");
exports.staffCategories = (0, pg_core_1.pgTable)("staff_categories", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    code: (0, pg_core_1.varchar)("code", { length: 50 }).notNull().unique(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description")
});
