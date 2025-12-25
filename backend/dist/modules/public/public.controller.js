"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPublicRequest = createPublicRequest;
const companies_1 = require("../../db/schema/companies");
const users_1 = require("../../db/schema/users");
const requests_1 = require("../../db/schema/requests");
const drizzle_orm_1 = require("drizzle-orm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../../db/db");
function toNumericOrNull(value) {
    if (value === undefined || value === null || value === "")
        return null;
    const normalized = String(value).replace(",", ".");
    const num = Number(normalized);
    if (Number.isNaN(num))
        return null;
    return num;
}
async function createPublicRequest(req, res) {
    try {
        const { email, phone, company, position, category, experience, salary, description, requirements, } = req.body;
        if (!email || !phone || !company || !position) {
            return res
                .status(400)
                .json({ message: "Обязательные поля не заполнены" });
        }
        // 2. Сначала проверяем пользователя
        const existingUserRows = await db_1.db
            .select()
            .from(users_1.users)
            .where((0, drizzle_orm_1.eq)(users_1.users.email, email))
            .limit(1);
        const existingUser = existingUserRows[0];
        let clientId;
        let companyId;
        if (existingUser) {
            // Если пользователь существует, используем его companyId
            clientId = existingUser.id;
            if (existingUser.companyId) {
                // Используем существующую компанию пользователя
                companyId = existingUser.companyId;
            }
            else {
                // Если у пользователя нет компании, создаем/находим по имени
                const existingCompanyRows = await db_1.db
                    .select()
                    .from(companies_1.companies)
                    .where((0, drizzle_orm_1.eq)(companies_1.companies.name, company))
                    .limit(1);
                const existingCompany = existingCompanyRows[0];
                if (existingCompany) {
                    companyId = existingCompany.id;
                }
                else {
                    const insertedCompanies = await db_1.db
                        .insert(companies_1.companies)
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
                // Привязываем компанию к пользователю
                await db_1.db
                    .update(users_1.users)
                    .set({ companyId })
                    .where((0, drizzle_orm_1.eq)(users_1.users.id, existingUser.id));
            }
        }
        else {
            // Новый пользователь - создаем компанию
            const existingCompanyRows = await db_1.db
                .select()
                .from(companies_1.companies)
                .where((0, drizzle_orm_1.eq)(companies_1.companies.name, company))
                .limit(1);
            const existingCompany = existingCompanyRows[0];
            if (existingCompany) {
                companyId = existingCompany.id;
            }
            else {
                const insertedCompanies = await db_1.db
                    .insert(companies_1.companies)
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
            const passwordHash = await bcryptjs_1.default.hash("password123", 10);
            const insertedUsers = await db_1.db
                .insert(users_1.users)
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
        let staffCategoryId = null;
        if (category) {
            // category приходит как id (строка числа)
            const categoryId = parseInt(category, 10);
            if (!isNaN(categoryId)) {
                staffCategoryId = categoryId;
            }
        }
        // 4. Заявка
        const insertedRequests = await db_1.db
            .insert(requests_1.requests)
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
            status: "NEW",
        })
            .returning();
        const createdRequest = insertedRequests[0];
        return res.status(201).json({
            message: "Заявка успешно создана",
            id: createdRequest.id,
        });
    }
    catch (err) {
        console.error("createPublicRequest error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
