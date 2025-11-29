// src/modules/public/public.controller.ts
import { Request, Response } from "express";
import { companies } from "../../db/schema/companies";
import { users } from "../../db/schema/users";
import { staffCategories } from "../../db/schema/staffCategories";
import { requests } from "../../db/schema/requests";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "../../db/db";

type PublicRequestBody = {
    email: string;
    phone: string;
    company: string;
    position: string;
    category?: string;     // TOP, IT, ADMIN, PROD, SALES
    experience?: string;
    salary?: string;
    description?: string;
    requirements?: string;
};

function toNumericOrNull(value: unknown) {
    if (value === undefined || value === null || value === "") return null;
    const normalized = String(value).replace(",", ".");
    const num = Number(normalized);
    if (Number.isNaN(num)) return null;
    return num;
}

export async function createPublicRequest(req: Request, res: Response) {
    try {
        const {
            email,
            phone,
            company,
            position,
            category,
            experience,
            salary,
            description,
            requirements,
        } = req.body as PublicRequestBody;

        if (!email || !phone || !company || !position) {
            return res
                .status(400)
                .json({ message: "Обязательные поля не заполнены" });
        }

        // 1. Компания
        const existingCompanyRows = await db
            .select()
            .from(companies)
            .where(eq(companies.name, company))
            .limit(1);

        const existingCompany = existingCompanyRows[0];

        let companyId: string;
        if (existingCompany) {
            companyId = existingCompany.id;
        } else {
            const insertedCompanies = await db
                .insert(companies)
                .values({
                    name: company,
                    email,
                    phone,
                    website: null,
                    description: null,
                    industry: null,
                    size: null,
                })
                .returning();

            companyId = insertedCompanies[0].id;
        }

        // 2. Клиент
        const existingUserRows = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        const existingUser = existingUserRows[0];

        let clientId: string;

        if (existingUser) {
            clientId = existingUser.id;

            // === ВАЖНЫЙ ФИКС: привязать существующего пользователя к компании ===
            if (!existingUser.companyId) {
                await db
                    .update(users)
                    .set({ companyId })
                    .where(eq(users.id, existingUser.id));
            }
        } else {
            const passwordHash = await bcrypt.hash("password123", 10);
            const insertedUsers = await db
                .insert(users)
                .values({
                    email,
                    passwordHash,
                    role: "client",
                    firstName: null,
                    lastName: null,
                    phone,
                    companyId,
                    isActive: true,
                })
                .returning();
            clientId = insertedUsers[0].id;
        }

        // 3. Категория
        let staffCategoryId: number | null = null;
        if (category) {
            const catRows = await db
                .select()
                .from(staffCategories)
                .where(eq(staffCategories.code, category))
                .limit(1);

            const cat = catRows[0];
            if (cat) {
                staffCategoryId = cat.id;
            }
        }

        // 4. Заявка
        const insertedRequests = await db
            .insert(requests)
            .values({
                companyId,
                createdBy: clientId,
                assignedManager: null,
                positionTitle: position,
                staffCategoryId,
                experienceYears: toNumericOrNull(experience),
                salaryFrom: toNumericOrNull(salary),
                salaryTo: null,
                currency: "KGS",
                description: description ?? null,
                keyRequirements: requirements ?? null,
                status: "new",
            } as any)
            .returning();

        const createdRequest = insertedRequests[0];

        return res.status(201).json({
            message: "Заявка успешно создана",
            id: createdRequest.id,
        });
    } catch (err) {
        console.error("createPublicRequest error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
