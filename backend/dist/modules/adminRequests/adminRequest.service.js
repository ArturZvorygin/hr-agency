"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRequestService = void 0;
// src/modules/adminRequests/adminRequest.service.ts
const db_1 = require("../../db/db");
const requests_1 = require("../../db/schema/requests");
const drizzle_orm_1 = require("drizzle-orm");
class AdminRequestService {
    // Все заявки, упорядоченные по дате создания (новые сверху), с фильтром по статусу
    async listAll(status) {
        const query = db_1.db.select().from(requests_1.requests);
        if (status) {
            const list = await query
                .where((0, drizzle_orm_1.eq)(requests_1.requests.status, status))
                .orderBy((0, drizzle_orm_1.desc)(requests_1.requests.createdAt));
            return list;
        }
        const list = await query.orderBy((0, drizzle_orm_1.desc)(requests_1.requests.createdAt));
        return list;
    }
    // Одна заявка по id
    async getById(id) {
        const [item] = await db_1.db
            .select()
            .from(requests_1.requests)
            .where((0, drizzle_orm_1.eq)(requests_1.requests.id, id))
            .limit(1);
        if (!item) {
            throw new Error("REQUEST_NOT_FOUND");
        }
        return item;
    }
    // Смена статуса заявки
    async changeStatus(id, dto) {
        // На диплом достаточно просто записать строку статуса
        const [updated] = await db_1.db
            .update(requests_1.requests)
            .set({
            status: dto.status,
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(requests_1.requests.id, id))
            .returning();
        if (!updated) {
            throw new Error("REQUEST_NOT_FOUND");
        }
        return updated;
    }
    // Опционально: список заявок, назначенных конкретному менеджеру
    async listAssignedToManager(managerId) {
        const list = await db_1.db
            .select()
            .from(requests_1.requests)
            .where((0, drizzle_orm_1.eq)(requests_1.requests.assignedManager, managerId))
            .orderBy((0, drizzle_orm_1.desc)(requests_1.requests.createdAt));
        return list;
    }
    // Назначить менеджера на заявку
    async assignManager(requestId, managerId) {
        const [updated] = await db_1.db
            .update(requests_1.requests)
            .set({
            assignedManager: managerId,
            updatedAt: new Date()
        })
            .where((0, drizzle_orm_1.eq)(requests_1.requests.id, requestId))
            .returning();
        if (!updated) {
            throw new Error("REQUEST_NOT_FOUND");
        }
        return updated;
    }
}
exports.adminRequestService = new AdminRequestService();
