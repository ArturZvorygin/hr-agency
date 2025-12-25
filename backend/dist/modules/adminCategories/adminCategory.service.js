"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCategoryService = void 0;
// src/modules/adminCategories/adminCategory.service.ts
const db_1 = require("../../db/db");
const staffCategories_1 = require("../../db/schema/staffCategories");
const drizzle_orm_1 = require("drizzle-orm");
class AdminCategoryService {
    async listAll() {
        return await db_1.db.select().from(staffCategories_1.staffCategories);
    }
    async getById(id) {
        const [item] = await db_1.db
            .select()
            .from(staffCategories_1.staffCategories)
            .where((0, drizzle_orm_1.eq)(staffCategories_1.staffCategories.id, id))
            .limit(1);
        if (!item) {
            throw new Error("CATEGORY_NOT_FOUND");
        }
        return item;
    }
    async create(dto) {
        const [created] = await db_1.db
            .insert(staffCategories_1.staffCategories)
            .values({
            code: dto.code,
            name: dto.name,
            description: dto.description || null,
        })
            .returning();
        return created;
    }
    async update(id, dto) {
        const [updated] = await db_1.db
            .update(staffCategories_1.staffCategories)
            .set(dto)
            .where((0, drizzle_orm_1.eq)(staffCategories_1.staffCategories.id, id))
            .returning();
        if (!updated) {
            throw new Error("CATEGORY_NOT_FOUND");
        }
        return updated;
    }
    async delete(id) {
        const [deleted] = await db_1.db
            .delete(staffCategories_1.staffCategories)
            .where((0, drizzle_orm_1.eq)(staffCategories_1.staffCategories.id, id))
            .returning();
        if (!deleted) {
            throw new Error("CATEGORY_NOT_FOUND");
        }
        return deleted;
    }
}
exports.adminCategoryService = new AdminCategoryService();
