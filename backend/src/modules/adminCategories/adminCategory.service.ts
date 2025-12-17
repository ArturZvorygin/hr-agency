// src/modules/adminCategories/adminCategory.service.ts
import { db } from "../../db/db";
import { staffCategories } from "../../db/schema/staffCategories";
import { eq } from "drizzle-orm";

type CreateCategoryDTO = {
    code: string;
    name: string;
    description?: string;
};

type UpdateCategoryDTO = {
    code?: string;
    name?: string;
    description?: string;
};

class AdminCategoryService {
    async listAll() {
        return await db.select().from(staffCategories);
    }

    async getById(id: number) {
        const [item] = await db
            .select()
            .from(staffCategories)
            .where(eq(staffCategories.id, id))
            .limit(1);

        if (!item) {
            throw new Error("CATEGORY_NOT_FOUND");
        }

        return item;
    }

    async create(dto: CreateCategoryDTO) {
        const [created] = await db
            .insert(staffCategories)
            .values({
                code: dto.code,
                name: dto.name,
                description: dto.description || null,
            })
            .returning();

        return created;
    }

    async update(id: number, dto: UpdateCategoryDTO) {
        const [updated] = await db
            .update(staffCategories)
            .set(dto)
            .where(eq(staffCategories.id, id))
            .returning();

        if (!updated) {
            throw new Error("CATEGORY_NOT_FOUND");
        }

        return updated;
    }

    async delete(id: number) {
        const [deleted] = await db
            .delete(staffCategories)
            .where(eq(staffCategories.id, id))
            .returning();

        if (!deleted) {
            throw new Error("CATEGORY_NOT_FOUND");
        }

        return deleted;
    }
}

export const adminCategoryService = new AdminCategoryService();
