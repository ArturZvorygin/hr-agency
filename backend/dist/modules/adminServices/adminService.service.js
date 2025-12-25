"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminServiceService = void 0;
// src/modules/adminServices/adminService.service.ts
const db_1 = require("../../db/db");
const services_1 = require("../../db/schema/services");
const drizzle_orm_1 = require("drizzle-orm");
class AdminServiceService {
    async create(dto) {
        const [created] = await db_1.db
            .insert(services_1.services)
            .values({
            name: dto.name,
            description: dto.description,
            basePrice: dto.basePrice,
            isActive: dto.isActive ?? true
        })
            .returning();
        return created;
    }
    async update(id, dto) {
        const [updated] = await db_1.db
            .update(services_1.services)
            .set({
            name: dto.name,
            description: dto.description,
            basePrice: dto.basePrice,
            isActive: dto.isActive ?? true
        })
            .where((0, drizzle_orm_1.eq)(services_1.services.id, id))
            .returning();
        if (!updated) {
            throw new Error("SERVICE_NOT_FOUND");
        }
        return updated;
    }
    async delete(id) {
        const [deleted] = await db_1.db
            .delete(services_1.services)
            .where((0, drizzle_orm_1.eq)(services_1.services.id, id))
            .returning();
        if (!deleted) {
            throw new Error("SERVICE_NOT_FOUND");
        }
        return deleted;
    }
}
exports.adminServiceService = new AdminServiceService();
