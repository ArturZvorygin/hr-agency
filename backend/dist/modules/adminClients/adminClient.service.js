"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminClientService = void 0;
// src/modules/adminClients/adminClient.service.ts
const db_1 = require("../../db/db");
const users_1 = require("../../db/schema/users");
const companies_1 = require("../../db/schema/companies");
const drizzle_orm_1 = require("drizzle-orm");
const password_1 = require("../../utils/password");
function cleanUndefined(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}
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
            companyEmail: companies_1.companies.email,
            companyPhone: companies_1.companies.phone,
            companyWebsite: companies_1.companies.website,
            companyDescription: companies_1.companies.description,
            companyIndustry: companies_1.companies.industry,
            companySize: companies_1.companies.size,
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
            companyEmail: companies_1.companies.email,
            companyPhone: companies_1.companies.phone,
            companyWebsite: companies_1.companies.website,
            companyDescription: companies_1.companies.description,
            companyIndustry: companies_1.companies.industry,
            companySize: companies_1.companies.size,
        })
            .from(users_1.users)
            .leftJoin(companies_1.companies, (0, drizzle_orm_1.eq)(users_1.users.companyId, companies_1.companies.id))
            .where((0, drizzle_orm_1.eq)(users_1.users.id, id))
            .limit(1);
        if (!item)
            throw new Error("CLIENT_NOT_FOUND");
        return item;
    }
    async updateClient(id, data) {
        // ✅ защищаемся от случайного апдейта не-клиента
        const [exists] = await db_1.db
            .select({ id: users_1.users.id })
            .from(users_1.users)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(users_1.users.id, id), (0, drizzle_orm_1.eq)(users_1.users.role, "client")))
            .limit(1);
        if (!exists)
            throw new Error("CLIENT_NOT_FOUND");
        const patch = cleanUndefined({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            isActive: data.isActive,
            updatedAt: new Date(),
        });
        await db_1.db.update(users_1.users).set(patch).where((0, drizzle_orm_1.eq)(users_1.users.id, id));
        return this.getClientById(id);
    }
    async updateClientCompany(clientId, companyData) {
        const client = await this.getClientById(clientId);
        if (!client.companyId) {
            throw new Error("CLIENT_HAS_NO_COMPANY");
        }
        const patch = cleanUndefined({
            name: companyData.name,
            email: companyData.email,
            phone: companyData.phone,
            website: companyData.website,
            description: companyData.description,
            industry: companyData.industry,
            size: companyData.size,
            updatedAt: new Date(),
        });
        await db_1.db.update(companies_1.companies).set(patch).where((0, drizzle_orm_1.eq)(companies_1.companies.id, client.companyId));
        return this.getClientById(clientId);
    }
    // ✅ КАСКАДНОЕ УДАЛЕНИЕ: requests -> user -> (опц) company
    async deleteClient(userId) {
        return db_1.db.transaction(async (tx) => {
            // 1) проверяем, что это client
            const [client] = await tx
                .select({ id: users_1.users.id, role: users_1.users.role, companyId: users_1.users.companyId })
                .from(users_1.users)
                .where((0, drizzle_orm_1.eq)(users_1.users.id, userId))
                .limit(1);
            if (!client)
                throw new Error("CLIENT_NOT_FOUND");
            if (String(client.role) !== "client")
                throw new Error("CLIENT_NOT_FOUND");
            // 2) удаляем все заявки клиента (FK requests_created_by_users_id_fk)
            // ⚠️ По названию constraint у тебя поле именно created_by
            await tx.execute((0, drizzle_orm_1.sql) `DELETE FROM "requests" WHERE "created_by" = ${userId}`);
            // (если у тебя есть связанные таблицы по requests — comments/candidates/etc — их тоже удаляй ДО requests)
            // 3) удаляем пользователя
            const [deleted] = await tx
                .delete(users_1.users)
                .where((0, drizzle_orm_1.eq)(users_1.users.id, userId))
                .returning({ id: users_1.users.id });
            if (!deleted)
                throw new Error("CLIENT_NOT_FOUND");
            // 4) опционально удаляем компанию, если в ней больше никого нет
            const companyId = client.companyId;
            if (companyId) {
                const [{ cnt }] = await tx
                    .select({ cnt: (0, drizzle_orm_1.sql) `count(*)` })
                    .from(users_1.users)
                    .where((0, drizzle_orm_1.eq)(users_1.users.companyId, companyId));
                if (Number(cnt) === 0) {
                    await tx.delete(companies_1.companies).where((0, drizzle_orm_1.eq)(companies_1.companies.id, companyId));
                }
            }
            return { id: deleted.id };
        });
    }
    async changeClientPassword(id, newPassword) {
        if (!newPassword || String(newPassword).length < 6) {
            throw new Error("PASSWORD_TOO_SHORT");
        }
        // ✅ защищаемся от смены пароля не-клиента
        const [exists] = await db_1.db
            .select({ id: users_1.users.id })
            .from(users_1.users)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(users_1.users.id, id), (0, drizzle_orm_1.eq)(users_1.users.role, "client")))
            .limit(1);
        if (!exists)
            throw new Error("CLIENT_NOT_FOUND");
        const passwordHash = await (0, password_1.hashPassword)(newPassword);
        await db_1.db
            .update(users_1.users)
            .set({
            passwordHash,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(users_1.users.id, id));
        return { ok: true };
    }
}
exports.adminClientService = new AdminClientService();
