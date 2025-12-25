"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRequestService = void 0;
// src/modules/adminRequests/adminRequest.service.ts
const db_1 = require("../../db/db");
const requests_1 = require("../../db/schema/requests");
const drizzle_orm_1 = require("drizzle-orm");
const companies_1 = require("../../db/schema/companies");
const users_1 = require("../../db/schema/users");
// ✅ добавили категории персонала
const staffCategories_1 = require("../../db/schema/staffCategories");
const pg_core_1 = require("drizzle-orm/pg-core");
const uClient = (0, pg_core_1.alias)(users_1.users, "uClient");
const uManager = (0, pg_core_1.alias)(users_1.users, "uManager");
class AdminRequestService {
    baseSelect() {
        return db_1.db
            .select({
            // requests
            id: requests_1.requests.id,
            status: requests_1.requests.status,
            createdAt: requests_1.requests.createdAt,
            updatedAt: requests_1.requests.updatedAt,
            companyId: requests_1.requests.companyId,
            staffCategoryId: requests_1.requests.staffCategoryId,
            createdBy: requests_1.requests.createdBy,
            assignedManager: requests_1.requests.assignedManager,
            positionTitle: requests_1.requests.positionTitle,
            description: requests_1.requests.description,
            keyRequirements: requests_1.requests.keyRequirements,
            experienceYears: requests_1.requests.experienceYears,
            salaryFrom: requests_1.requests.salaryFrom,
            salaryTo: requests_1.requests.salaryTo,
            currency: requests_1.requests.currency,
            // "реальные" поля для фронта
            companyName: companies_1.companies.name,
            // клиент (минимально безопасно)
            clientEmail: uClient.email,
            clientName: uClient.email,
            // менеджер (минимально безопасно)
            managerName: uManager.email,
            // ✅ категория персонала
            staffCategoryName: staffCategories_1.staffCategories.name,
        })
            .from(requests_1.requests)
            .leftJoin(companies_1.companies, (0, drizzle_orm_1.eq)(requests_1.requests.companyId, companies_1.companies.id))
            .leftJoin(uClient, (0, drizzle_orm_1.eq)(requests_1.requests.createdBy, uClient.id))
            .leftJoin(uManager, (0, drizzle_orm_1.eq)(requests_1.requests.assignedManager, uManager.id))
            // ✅ join категории (важно LEFT JOIN, потому что staffCategoryId может быть null)
            .leftJoin(staffCategories_1.staffCategories, (0, drizzle_orm_1.eq)(requests_1.requests.staffCategoryId, staffCategories_1.staffCategories.id));
    }
    async listAll(status) {
        const q = this.baseSelect();
        return status
            ? await q.where((0, drizzle_orm_1.eq)(requests_1.requests.status, status)).orderBy((0, drizzle_orm_1.desc)(requests_1.requests.createdAt))
            : await q.orderBy((0, drizzle_orm_1.desc)(requests_1.requests.createdAt));
    }
    async getById(id) {
        const [item] = await this.baseSelect().where((0, drizzle_orm_1.eq)(requests_1.requests.id, id)).limit(1);
        if (!item)
            throw new Error("REQUEST_NOT_FOUND");
        return item;
    }
    async changeStatus(id, dto) {
        const res = await db_1.db
            .update(requests_1.requests)
            .set({ status: dto.status, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(requests_1.requests.id, id))
            .returning({ id: requests_1.requests.id });
        if (!res[0])
            throw new Error("REQUEST_NOT_FOUND");
        return this.getById(id);
    }
    async listAssignedToManager(managerId) {
        return this.baseSelect()
            .where((0, drizzle_orm_1.eq)(requests_1.requests.assignedManager, managerId))
            .orderBy((0, drizzle_orm_1.desc)(requests_1.requests.createdAt));
    }
    async assignManager(requestId, managerId) {
        const res = await db_1.db
            .update(requests_1.requests)
            .set({ assignedManager: managerId, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(requests_1.requests.id, requestId))
            .returning({ id: requests_1.requests.id });
        if (!res[0])
            throw new Error("REQUEST_NOT_FOUND");
        return this.getById(requestId);
    }
    async updateRequest(id, data) {
        const res = await db_1.db
            .update(requests_1.requests)
            .set({
            ...data,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(requests_1.requests.id, id))
            .returning({ id: requests_1.requests.id });
        if (!res[0])
            throw new Error("REQUEST_NOT_FOUND");
        return this.getById(id);
    }
    async deleteRequest(id) {
        const res = await db_1.db
            .delete(requests_1.requests)
            .where((0, drizzle_orm_1.eq)(requests_1.requests.id, id))
            .returning({ id: requests_1.requests.id });
        if (!res[0])
            throw new Error("REQUEST_NOT_FOUND");
        return res[0];
    }
}
exports.adminRequestService = new AdminRequestService();
