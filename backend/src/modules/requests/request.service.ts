// src/modules/requests/request.service.ts
import { db } from "../../db/db";
import { users } from "../../db/schema/users";
import { requests } from "../../db/schema/requests";
import { and, eq, desc } from "drizzle-orm";

export type CreateRequestDTO = {
    positionTitle: string;
    staffCategoryId?: number;
    experienceYears?: number;
    salaryFrom?: number;
    salaryTo?: number;
    currency?: string;
    description?: string;
    keyRequirements?: string;
    isDraft?: boolean;
};

class RequestService {
    private async getUserWithCompany(userId: string) {
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        if (!user) throw new Error("USER_NOT_FOUND");
        if (!user.companyId) throw new Error("COMPANY_NOT_ASSIGNED");

        return user;
    }

    async createRequest(userId: string, dto: CreateRequestDTO) {
        const user = await this.getUserWithCompany(userId);

        const [created] = await db
            .insert(requests)
            .values({
                companyId: user.companyId!,
                createdBy: user.id,
                positionTitle: dto.positionTitle,
                staffCategoryId: dto.staffCategoryId,
                experienceYears: dto.experienceYears,
                salaryFrom: dto.salaryFrom,
                salaryTo: dto.salaryTo,
                currency: dto.currency || "РУБ",
                description: dto.description,
                keyRequirements: dto.keyRequirements,
                status: dto.isDraft ? "DRAFT" : "NEW",
            } as any)
            .returning();

        return created;
    }

    // "Мои заявки":
    // - client  → только свои (createdBy = user.id)
    // - manager/admin → все заявки компании
    // Опционально фильтр по статусу
    async listMyRequests(userId: string, status?: string) {
        const user = await this.getUserWithCompany(userId);

        const companyFilter = eq(requests.companyId, user.companyId!);

        let whereClause =
            user.role === "client"
                ? and(companyFilter, eq(requests.createdBy, user.id))
                : companyFilter; // manager/admin видят всё по компании

        if (status && whereClause) {
            whereClause = and(whereClause, eq(requests.status, status));
        } else if (status) {
            whereClause = eq(requests.status, status);
        }

        const list = await db
            .select()
            .from(requests)
            .where(whereClause)
            .orderBy(desc(requests.createdAt));

        return list;
    }

    async getMyRequestById(userId: string, requestId: string) {
        const user = await this.getUserWithCompany(userId);

        const base = and(
            eq(requests.id, requestId),
            eq(requests.companyId, user.companyId!)
        );

        const whereClause =
            user.role === "client"
                ? and(base, eq(requests.createdBy, user.id))
                : base;

        const [reqItem] = await db
            .select()
            .from(requests)
            .where(whereClause)
            .limit(1);

        if (!reqItem) throw new Error("REQUEST_NOT_FOUND");

        return reqItem;
    }
}

export const requestService = new RequestService();
