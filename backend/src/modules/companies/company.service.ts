// src/modules/companies/company.service.ts
import { db } from "../../db/db";
import { users } from "../../db/schema/users";
import { companies } from "../../db/schema/companies";
import { eq } from "drizzle-orm";

type UpdateCompanyDTO = {
    name?: string;
    email?: string;
    phone?: string;
    website?: string;
    description?: string;
    industry?: string;
    size?: string;
};

class CompanyService {
    // Получить компанию текущего пользователя
    async getMyCompany(userId: string) {
        const user = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.id, userId)
        });

        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        if (!user.companyId) {
            throw new Error("COMPANY_NOT_ASSIGNED");
        }

        const company = await db.query.companies.findFirst({
            where: (c, { eq }) => eq(c.id, user.companyId!)
        });

        if (!company) {
            throw new Error("COMPANY_NOT_FOUND");
        }

        return company;
    }

    // Обновить компанию текущего пользователя (частичное обновление)
    async updateMyCompany(userId: string, dto: UpdateCompanyDTO) {
        const user = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.id, userId)
        });

        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        if (!user.companyId) {
            throw new Error("COMPANY_NOT_ASSIGNED");
        }

        // Фильтруем только переданные поля
        const updateData: UpdateCompanyDTO = {};
        if (dto.name !== undefined) updateData.name = dto.name;
        if (dto.email !== undefined) updateData.email = dto.email;
        if (dto.phone !== undefined) updateData.phone = dto.phone;
        if (dto.website !== undefined) updateData.website = dto.website;
        if (dto.description !== undefined) updateData.description = dto.description;
        if (dto.industry !== undefined) updateData.industry = dto.industry;
        if (dto.size !== undefined) updateData.size = dto.size;

        if (Object.keys(updateData).length === 0) {
            // Нечего обновлять
            return this.getMyCompany(user.id);
        }

        const [updated] = await db
            .update(companies)
            .set(updateData)
            .where(eq(companies.id, user.companyId))
            .returning();

        return updated;
    }
}

export const companyService = new CompanyService();
