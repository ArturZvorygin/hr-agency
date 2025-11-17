// src/modules/adminRequests/adminRequest.service.ts
import { db } from "../../db";
import { requests } from "../../db/schema/requests";
import { and, desc, eq } from "drizzle-orm";

type ChangeStatusDTO = {
    status: string;
};

class AdminRequestService {
    // Все заявки, упорядоченные по дате создания (новые сверху)
    async listAll() {
        const list = await db
            .select()
            .from(requests)
            .orderBy(desc(requests.createdAt));

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
}

export const adminRequestService = new AdminRequestService();
