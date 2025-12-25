"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = void 0;
// src/db/schema/services.ts
const pg_core_1 = require("drizzle-orm/pg-core");
exports.services = (0, pg_core_1.pgTable)("services", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    basePrice: (0, pg_core_1.numeric)("base_price", { precision: 12, scale: 2 }),
    isActive: (0, pg_core_1.boolean)("is_active").notNull().default(true)
});
