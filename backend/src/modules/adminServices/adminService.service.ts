// src/modules/adminServices/adminService.service.ts
import { db } from "../../db";
import { services } from "../../db/schema/services";
import { eq } from "drizzle-orm";

export type ServiceDTO = {
    name: string;
    description?: string;
    basePrice?: number;
    isActive?: boolean;
};

class AdminServiceService {
    async create(dto: ServiceDTO) {
        const [created] = await db
            .insert(services)
            .values({
                name: dto.name,
                description: dto.description,
                basePrice: dto.basePrice,
                isActive: dto.isActive ?? true
            } as any)
            .returning();

        return created;
    }

    async update(id: number, dto: ServiceDTO) {
        const [updated] = await db
            .update(services)
            .set({
                name: dto.name,
                description: dto.description,
                basePrice: dto.basePrice,
                isActive: dto.isActive ?? true
            } as any)
            .where(eq(services.id, id))
            .returning();

        if (!updated) {
            throw new Error("SERVICE_NOT_FOUND");
        }

        return updated;
    }

    async delete(id: number) {
        const [deleted] = await db
            .delete(services)
            .where(eq(services.id, id))
            .returning();

        if (!deleted) {
            throw new Error("SERVICE_NOT_FOUND");
        }

        return deleted;
    }
}

export const adminServiceService = new AdminServiceService();
