"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminClientService = void 0;
// src/modules/adminClients/adminClient.service.ts
const db_1 = require("../../db/db");
const users_1 = require("../../db/schema/users");
const companies_1 = require("../../db/schema/companies");
const drizzle_orm_1 = require("drizzle-orm");
class AdminClientService {
    async listAllClients() {
        const list = await db_1.db
            .select({
            id: users_1.users.id,
            email: users_1.users.email,
            firstName: users_1.users.firstName,
            lastName: users_1.users.lastName,
            phone: users_1.users.phone,
            role: users_1.users.role,
            companyId: users_1.users.companyId,
            isActive: users_1.users.isActive,
            createdAt: users_1.users.createdAt,
            companyName: companies_1.companies.name,
        })
            .from(users_1.users)
            .leftJoin(companies_1.companies, (0, drizzle_orm_1.eq)(users_1.users.companyId, companies_1.companies.id))
            .where((0, drizzle_orm_1.eq)(users_1.users.role, "client"));
        return list;
    }
    async getClientById(id) {
        const [item] = await db_1.db
            .select({
            id: users_1.users.id,
            email: users_1.users.email,
            firstName: users_1.users.firstName,
            lastName: users_1.users.lastName,
            phone: users_1.users.phone,
            role: users_1.users.role,
            companyId: users_1.users.companyId,
            isActive: users_1.users.isActive,
            createdAt: users_1.users.createdAt,
            companyName: companies_1.companies.name,
        })
            .from(users_1.users)
            .leftJoin(companies_1.companies, (0, drizzle_orm_1.eq)(users_1.users.companyId, companies_1.companies.id))
            .where((0, drizzle_orm_1.eq)(users_1.users.id, id))
            .limit(1);
        if (!item) {
            throw new Error("CLIENT_NOT_FOUND");
        }
        return item;
    }
}
exports.adminClientService = new AdminClientService();
