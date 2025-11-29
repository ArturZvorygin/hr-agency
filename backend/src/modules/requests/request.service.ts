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
                currency: dto.currency || "KGS",
                description: dto.description,
                keyRequirements: dto.keyRequirements,
                status: "new"
            } as any) // для диплома можно закастить, чтобы не ругался TS
            .returning();

        return created;
    }

    async listMyRequests(userId: string) {
        const user = await this.getUserWithCompany(userId);

        const list = await db
            .select()
            .from(requests)
            .where(eq(requests.companyId, user.companyId!))
            .orderBy(desc(requests.createdAt));

        return list;
    }

    async getMyRequestById(userId: string, requestId: string) {
        const user = await this.getUserWithCompany(userId);

        const [reqItem] = await db
            .select()
            .from(requests)
            .where(
                and(
                    eq(requests.id, requestId),
                    eq(requests.companyId, user.companyId!)
                )
            )
            .limit(1);

        if (!reqItem) throw new Error("REQUEST_NOT_FOUND");

        return reqItem;
    }
}

export const requestService = new RequestService();
