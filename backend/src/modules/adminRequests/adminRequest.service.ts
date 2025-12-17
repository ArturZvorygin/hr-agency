// src/modules/adminRequests/adminRequest.service.ts
import { db } from "../../db/db";
import { requests } from "../../db/schema/requests";
import { and, desc, eq } from "drizzle-orm";

type ChangeStatusDTO = {
    status: string;
};

class AdminRequestService {
    // Все заявки, упорядоченные по дате создания (новые сверху), с фильтром по статусу
    async listAll(status?: string) {
        const query = db.select().from(requests);

        if (status) {
            const list = await query
                .where(eq(requests.status, status))
                .orderBy(desc(requests.createdAt));
            return list;
        }

        const list = await query.orderBy(desc(requests.createdAt));
        return list;
    }

    // Одна заявка по id
    async getById(id: string) {
        const [item] = await db
            .select()
            .from(requests)
            .where(eq(requests.id, id))
            .limit(1);

        if (!item) {
            throw new Error("REQUEST_NOT_FOUND");
        }

        return item;
    }

    // Смена статуса заявки
    async changeStatus(id: string, dto: ChangeStatusDTO) {
        // На диплом достаточно просто записать строку статуса
        const [updated] = await db
            .update(requests)
            .set({
                status: dto.status,
                updatedAt: new Date()
            } as any)
            .where(eq(requests.id, id))
            .returning();

        if (!updated) {
            throw new Error("REQUEST_NOT_FOUND");
        }

        return updated;
    }

    // Опционально: список заявок, назначенных конкретному менеджеру
    async listAssignedToManager(managerId: string) {
        const list = await db
            .select()
            .from(requests)
            .where(eq(requests.assignedManager, managerId))
            .orderBy(desc(requests.createdAt));

        return list;
    }

    // Назначить менеджера на заявку
    async assignManager(requestId: string, managerId: string) {
        const [updated] = await db
            .update(requests)
            .set({
                assignedManager: managerId,
                updatedAt: new Date()
            } as any)
            .where(eq(requests.id, requestId))
            .returning();

        if (!updated) {
            throw new Error("REQUEST_NOT_FOUND");
        }

        return updated;
    }
}

export const adminRequestService = new AdminRequestService();
