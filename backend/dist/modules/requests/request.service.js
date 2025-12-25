"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestService = void 0;
// src/modules/requests/request.service.ts
const db_1 = require("../../db/db");
const users_1 = require("../../db/schema/users");
const requests_1 = require("../../db/schema/requests");
const drizzle_orm_1 = require("drizzle-orm");
class RequestService {
    async getUserWithCompany(userId) {
        const [user] = await db_1.db
            .select()
            .from(users_1.users)
            .where((0, drizzle_orm_1.eq)(users_1.users.id, userId))
            .limit(1);
        if (!user)
            throw new Error("USER_NOT_FOUND");
        if (!user.companyId)
            throw new Error("COMPANY_NOT_ASSIGNED");
        return user;
    }
    async createRequest(userId, dto) {
        const user = await this.getUserWithCompany(userId);
        const [created] = await db_1.db
            .insert(requests_1.requests)
            .values({
            companyId: user.companyId,
            createdBy: user.id,
            positionTitle: dto.positionTitle,
            staffCategoryId: dto.staffCategoryId,
            experienceYears: dto.experienceYears,
            salaryFrom: dto.salaryFrom,
            salaryTo: dto.salaryTo,
            currency: dto.currency || "KGS",
            description: dto.description,
            keyRequirements: dto.keyRequirements,
            status: dto.isDraft ? "DRAFT" : "NEW",
        })
            .returning();
        return created;
    }
    // "Мои заявки":
    // - client  → только свои (createdBy = user.id)
    // - manager/admin → все заявки компании
    // Опционально фильтр по статусу
    async listMyRequests(userId, status) {
        const user = await this.getUserWithCompany(userId);
        const companyFilter = (0, drizzle_orm_1.eq)(requests_1.requests.companyId, user.companyId);
        let whereClause = user.role === "client"
            ? (0, drizzle_orm_1.and)(companyFilter, (0, drizzle_orm_1.eq)(requests_1.requests.createdBy, user.id))
            : companyFilter; // manager/admin видят всё по компании
        if (status && whereClause) {
            whereClause = (0, drizzle_orm_1.and)(whereClause, (0, drizzle_orm_1.eq)(requests_1.requests.status, status));
        }
        else if (status) {
            whereClause = (0, drizzle_orm_1.eq)(requests_1.requests.status, status);
        }
        const list = await db_1.db
            .select()
            .from(requests_1.requests)
            .where(whereClause)
            .orderBy((0, drizzle_orm_1.desc)(requests_1.requests.createdAt));
        return list;
    }
    async getMyRequestById(userId, requestId) {
        const user = await this.getUserWithCompany(userId);
        const base = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(requests_1.requests.id, requestId), (0, drizzle_orm_1.eq)(requests_1.requests.companyId, user.companyId));
        const whereClause = user.role === "client"
            ? (0, drizzle_orm_1.and)(base, (0, drizzle_orm_1.eq)(requests_1.requests.createdBy, user.id))
            : base;
        const [reqItem] = await db_1.db
            .select()
            .from(requests_1.requests)
            .where(whereClause)
            .limit(1);
        if (!reqItem)
            throw new Error("REQUEST_NOT_FOUND");
        return reqItem;
    }
}
exports.requestService = new RequestService();
