"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyService = void 0;
// src/modules/companies/company.service.ts
const db_1 = require("../../db/db");
const companies_1 = require("../../db/schema/companies");
const drizzle_orm_1 = require("drizzle-orm");
class CompanyService {
    // Получить компанию текущего пользователя
    async getMyCompany(userId) {
        const user = await db_1.db.query.users.findFirst({
            where: (u, { eq }) => eq(u.id, userId)
        });
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }
        if (!user.companyId) {
            throw new Error("COMPANY_NOT_ASSIGNED");
        }
        const company = await db_1.db.query.companies.findFirst({
            where: (c, { eq }) => eq(c.id, user.companyId)
        });
        if (!company) {
            throw new Error("COMPANY_NOT_FOUND");
        }
        return company;
    }
    // Обновить компанию текущего пользователя (частичное обновление)
    async updateMyCompany(userId, dto) {
        const user = await db_1.db.query.users.findFirst({
            where: (u, { eq }) => eq(u.id, userId)
        });
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }
        if (!user.companyId) {
            throw new Error("COMPANY_NOT_ASSIGNED");
        }
        // Фильтруем только переданные поля
        const updateData = {};
        if (dto.name !== undefined)
            updateData.name = dto.name;
        if (dto.email !== undefined)
            updateData.email = dto.email;
        if (dto.phone !== undefined)
            updateData.phone = dto.phone;
        if (dto.website !== undefined)
            updateData.website = dto.website;
        if (dto.description !== undefined)
            updateData.description = dto.description;
        if (dto.industry !== undefined)
            updateData.industry = dto.industry;
        if (dto.size !== undefined)
            updateData.size = dto.size;
        if (Object.keys(updateData).length === 0) {
            // Нечего обновлять
            return this.getMyCompany(user.id);
        }
        const [updated] = await db_1.db
            .update(companies_1.companies)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(companies_1.companies.id, user.companyId))
            .returning();
        return updated;
    }
}
exports.companyService = new CompanyService();
