// src/db/seed.ts
import "dotenv/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { companies } from "./schema/companies";
import { users } from "./schema/users";
import { staffCategories } from "./schema/staffCategories";
import { services } from "./schema/services";
import { requests } from "./schema/requests";

async function seed() {
    console.log("=== Запуск seed ===");

    // 1. Компания "Наши люди"
    let companyId: string;

    const existingCompanyRows = await db
        .select()
        .from(companies)
        .where(eq(companies.name, 'ООО "Наши люди"'))
        .limit(1);

    const existingCompany = existingCompanyRows[0];

    if (existingCompany) {
        companyId = existingCompany.id;
        console.log("Компания уже существует:", companyId);
    } else {
        const insertedCompanies = await db
            .insert(companies)
            .values({
                name: 'ООО "Наши люди"',
                email: "info@nashi-ludi.test",
                phone: "+996700000000",
                website: "https://nashi-ludi.test",
                description: "Кадровое агентство для бизнеса",
                industry: "HR/Recruitment",
                size: "11-50",
            })
            .returning();

        const createdCompany = insertedCompanies[0];
        companyId = createdCompany.id;
        console.log("Создали компанию:", companyId);
    }

    // 2. Пользователи: admin и client
    const passwordPlain = "password123";
    const passwordHash = await bcrypt.hash(passwordPlain, 10);

    // Админ
    let adminId: string;
    const existingAdminRows = await db
        .select()
        .from(users)
        .where(eq(users.email, "admin@example.com"))
        .limit(1);

    const existingAdmin = existingAdminRows[0];

    if (existingAdmin) {
        adminId = existingAdmin.id;
        console.log("Админ уже существует:", adminId);
    } else {
        const insertedAdmins = await db
            .insert(users)
            .values({
                email: "admin@example.com",
                passwordHash,
                role: "admin",
                firstName: "Админ",
                lastName: "Системный",
                phone: "+996700000001",
                companyId: null,
                isActive: true,
            })
            .returning();

        const admin = insertedAdmins[0];
        adminId = admin.id;
        console.log("Создали админа:", adminId);
    }

    // Клиент
    let clientId: string;
    const existingClientRows = await db
        .select()
        .from(users)
        .where(eq(users.email, "client1@example.com"))
        .limit(1);

    const existingClient = existingClientRows[0];

    if (existingClient) {
        clientId = existingClient.id;
        console.log("Клиент уже существует:", clientId);
    } else {
        const insertedClients = await db
            .insert(users)
            .values({
                email: "client1@example.com",
                passwordHash,
                role: "client",
                firstName: "Иван",
                lastName: "Клиентов",
                phone: "+996700000002",
                companyId,
                isActive: true,
            })
            .returning();

        const client = insertedClients[0];
        clientId = client.id;
        console.log("Создали клиента:", clientId);
    }

    // 3. Категории персонала (staff_categories)
    const categoriesData = [
        { code: "TOP", name: "Топ-менеджмент" },
        { code: "IT", name: "IT-специалисты" },
        { code: "ADMIN", name: "Административный персонал" },
        { code: "PROD", name: "Производственный персонал" },
        { code: "SALES", name: "Специалисты продаж" },
    ];

    for (const cat of categoriesData) {
        const existsRows = await db
            .select()
            .from(staffCategories)
            .where(eq(staffCategories.code, cat.code))
            .limit(1);

        const exists = existsRows[0];

        if (!exists) {
            await db.insert(staffCategories).values({
                code: cat.code,
                name: cat.name,
                description: null,
            });
            console.log("Добавили категорию:", cat.code);
        }
    }

    const itCategoryRows = await db
        .select()
        .from(staffCategories)
        .where(eq(staffCategories.code, "IT"))
        .limit(1);
    const itCategory = itCategoryRows[0];

    // 4. Услуги (services)
    const servicesData = [
        {
            name: "Подбор менеджеров среднего звена",
            description: "Поиск и отбор менеджеров продаж, маркетинга, HR.",
            basePrice: "50000",
        },
        {
            name: "Подбор IT-специалистов",
            description: "Разработчики, тимлиды, проджекты, аналитики.",
            basePrice: "80000",
        },
        {
            name: "Массовый подбор линейного персонала",
            description: "Ритейл, склады, производство.",
            basePrice: "30000",
        },
    ];

    for (const s of servicesData) {
        const existsRows = await db
            .select()
            .from(services)
            .where(eq(services.name, s.name))
            .limit(1);

        const exists = existsRows[0];

        if (!exists) {
            await db.insert(services).values({
                name: s.name,
                description: s.description,
                basePrice: s.basePrice, // numeric как string
                isActive: true,
            });
            console.log("Добавили услугу:", s.name);
        }
    }

    // 5. Тестовые заявки (requests)
    const existingRequestsRows = await db
        .select()
        .from(requests)
        .where(eq(requests.companyId, companyId));

    if (existingRequestsRows.length === 0) {
        await db.insert(requests).values([
            {
                companyId,
                createdBy: clientId,
                assignedManager: adminId,
                positionTitle: "Frontend-разработчик",
                staffCategoryId: itCategory ? itCategory.id : null,
                experienceYears: "3.0",
                salaryFrom: "80000",
                salaryTo: "120000",
                currency: "KGS",
                description: "Разработка и поддержка фронтенда для web-приложений.",
                keyRequirements:
                    "React, TypeScript, опыт работы с REST API, понимание UX.",
                status: "new",
            },
            {
                companyId,
                createdBy: clientId,
                assignedManager: adminId,
                positionTitle: "HR-менеджер",
                staffCategoryId: null,
                experienceYears: "2.0",
                salaryFrom: "60000",
                salaryTo: "90000",
                currency: "KGS",
                description:
                    "Подбор персонала, адаптация сотрудников, участие в HR-проектах.",
                keyRequirements:
                    "Опыт подбора, знание HR-инструментов, коммуникабельность.",
                status: "in_progress",
            },
        ]);
        console.log("Создали тестовые заявки");
    } else {
        console.log("Заявки уже существуют, пропускаем создание");
    }

    console.log("=== Seed завершён ===");
}

seed()
    .then(() => {
        console.log("Готово");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Ошибка seed:", err);
        process.exit(1);
    });
