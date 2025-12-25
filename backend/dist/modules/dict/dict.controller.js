"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dictController = void 0;
const db_1 = require("../../db/db");
const staffCategories_1 = require("../../db/schema/staffCategories");
const services_1 = require("../../db/schema/services");
const drizzle_orm_1 = require("drizzle-orm"); // <= вот это важно
class DictController {
    async getStaffCategories(req, res) {
        try {
            const items = await db_1.db.select().from(staffCategories_1.staffCategories);
            return res.status(200).json({ items });
        }
        catch (err) {
            console.error("getStaffCategories error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async getServices(req, res) {
        try {
            const items = await db_1.db
                .select()
                .from(services_1.services)
                .where((0, drizzle_orm_1.eq)(services_1.services.isActive, true)); // <= тут eq(...)
            return res.status(200).json({ items });
        }
        catch (err) {
            console.error("getServices error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.dictController = new DictController();
