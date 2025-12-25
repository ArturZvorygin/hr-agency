// src/modules/adminRequests/adminRequest.service.ts
import { db } from "../../db/db";
import { requests } from "../../db/schema/requests";
import { desc, eq } from "drizzle-orm";

import { companies } from "../../db/schema/companies";
import { users } from "../../db/schema/users";

// ✅ добавили категории персонала
import { staffCategories } from "../../db/schema/staffCategories";

import { alias } from "drizzle-orm/pg-core";

type ChangeStatusDTO = { status: string };

const uClient = alias(users, "uClient");
const uManager = alias(users, "uManager");

class AdminRequestService {
    private baseSelect() {
        return db
            .select({
                // requests
                id: requests.id,
                status: requests.status,
                createdAt: requests.createdAt,
                updatedAt: requests.updatedAt,
                companyId: requests.companyId,
                staffCategoryId: requests.staffCategoryId,
                createdBy: requests.createdBy,
                assignedManager: requests.assignedManager,

                positionTitle: requests.positionTitle,
                description: requests.description,
                keyRequirements: requests.keyRequirements,
                experienceYears: requests.experienceYears,
                salaryFrom: requests.salaryFrom,
                salaryTo: requests.salaryTo,
                currency: requests.currency,

                // "реальные" поля для фронта
                companyName: companies.name,

                // клиент (минимально безопасно)
                clientEmail: uClient.email,
                clientName: uClient.email,

                // менеджер (минимально безопасно)
                managerName: uManager.email,

                // ✅ категория персонала
                staffCategoryName: staffCategories.name,
            })
            .from(requests)
            .leftJoin(companies, eq(requests.companyId, companies.id))
            .leftJoin(uClient, eq(requests.createdBy, uClient.id))
            .leftJoin(uManager, eq(requests.assignedManager, uManager.id))
            // ✅ join категории (важно LEFT JOIN, потому что staffCategoryId может быть null)
            .leftJoin(staffCategories, eq(requests.staffCategoryId, staffCategories.id));
    }

    async listAll(status?: string) {
        const q = this.baseSelect();
        return status
            ? await q.where(eq(requests.status, status)).orderBy(desc(requests.createdAt))
            : await q.orderBy(desc(requests.createdAt));
    }

    async getById(id: string) {
        const [item] = await this.baseSelect().where(eq(requests.id, id)).limit(1);
        if (!item) throw new Error("REQUEST_NOT_FOUND");
        return item;
    }

    async changeStatus(id: string, dto: ChangeStatusDTO) {
        const res = await db
            .update(requests)
            .set({ status: dto.status, updatedAt: new Date() } as any)
            .where(eq(requests.id, id))
            .returning({ id: requests.id });

        if (!res[0]) throw new Error("REQUEST_NOT_FOUND");
        return this.getById(id);
    }

    async listAssignedToManager(managerId: string) {
        return this.baseSelect()
            .where(eq(requests.assignedManager, managerId))
            .orderBy(desc(requests.createdAt));
    }

    async assignManager(requestId: string, managerId: string) {
        const res = await db
            .update(requests)
            .set({ assignedManager: managerId, updatedAt: new Date() } as any)
            .where(eq(requests.id, requestId))
            .returning({ id: requests.id });

        if (!res[0]) throw new Error("REQUEST_NOT_FOUND");
        return this.getById(requestId);
    }
}

export const adminRequestService = new AdminRequestService();
