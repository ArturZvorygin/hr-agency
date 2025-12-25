"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/db/seed.ts
require("dotenv/config");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("./db");
const companies_1 = require("./schema/companies");
const users_1 = require("./schema/users");
const staffCategories_1 = require("./schema/staffCategories");
const services_1 = require("./schema/services");
const requests_1 = require("./schema/requests");
async function seed() {
    console.log("=== Запуск seed ===");
    // ------------------------------------
    // 0. Полная очистка таблиц
    // ВАЖНО: TRUNCATE ... CASCADE — снесёт связанные записи.
    // ------------------------------------
    console.log("Очищаем таблицы...");
    await db_1.db.execute((0, drizzle_orm_1.sql) `
        TRUNCATE TABLE
            "requests",
            "services",
            "staff_categories",
            "users",
            "companies"
        RESTART IDENTITY CASCADE;
    `);
    console.log("Таблицы очищены");
    // ------------------------------------
    // 1. Компания "Наши люди" (РФ)
    // ------------------------------------
    console.log("Создаём компанию...");
    const [createdCompany] = await db_1.db
        .insert(companies_1.companies)
        .values({
        name: 'ООО "Наши люди"',
        email: "info@nashi-ludi.ru",
        phone: "+7 (495) 000-00-00",
        website: "https://nashi-ludi.ru",
        description: "HR-агентство «Наши люди» — профессиональный подбор персонала для компаний по всей России.",
        industry: "HR / Recruitment",
        size: "11–50 сотрудников",
    })
        .returning();
    const companyId = createdCompany.id;
    console.log("Компания создана:", companyId);
    // ------------------------------------
    // 2. Пользователи: admin и client
    // ------------------------------------
    console.log("Создаём пользователей (админ + клиент)...");
    // Логины / пароли ДЛЯ ТЕСТА:
    // Админ:
    //   email:    admin@nashi-ludi.ru
    //   password: Admin123!
    //
    // Клиент:
    //   email:    client@nashi-ludi.ru
    //   password: Client123!
    const adminEmail = "admin@nashi-ludi.ru";
    const clientEmail = "client@nashi-ludi.ru";
    const adminPasswordPlain = "Admin123!";
    const clientPasswordPlain = "Client123!";
    const adminPasswordHash = await bcryptjs_1.default.hash(adminPasswordPlain, 10);
    const clientPasswordHash = await bcryptjs_1.default.hash(clientPasswordPlain, 10);
    // --- Админ ---
    const [admin] = await db_1.db
        .insert(users_1.users)
        .values({
        email: adminEmail,
        passwordHash: adminPasswordHash,
        role: "admin",
        firstName: "Администратор",
        lastName: "Системы",
        phone: "+7 (495) 000-00-01",
        companyId: null, // админ не привязан к конкретной компании
        isActive: true,
    })
        .returning();
    const adminId = admin.id;
    console.log("Админ создан:", adminId);
    // --- Клиент ---
    const [client] = await db_1.db
        .insert(users_1.users)
        .values({
        email: clientEmail,
        passwordHash: clientPasswordHash,
        role: "client",
        firstName: "Алексей",
        lastName: "Клиентов",
        phone: "+7 (495) 000-00-02",
        companyId, // клиент привязан к компании "Наши люди"
        isActive: true,
    })
        .returning();
    const clientId = client.id;
    console.log("Клиент создан:", clientId);
    // ------------------------------------
    // 3. Категории персонала (staff_categories)
    // ------------------------------------
    console.log("Создаём категории персонала...");
    const categoriesData = [
        { code: "TOP", name: "Топ-менеджмент" },
        { code: "IT", name: "IT-специалисты" },
        { code: "ADMIN", name: "Административный персонал" },
        { code: "PROD", name: "Производственный персонал" },
        { code: "SALES", name: "Специалисты по продажам" },
    ];
    const categoriesInserted = await db_1.db
        .insert(staffCategories_1.staffCategories)
        .values(categoriesData.map((cat) => ({
        code: cat.code,
        name: cat.name,
        description: null,
    })))
        .returning();
    const itCategory = categoriesInserted.find((c) => c.code === "IT") || null;
    const topCategory = categoriesInserted.find((c) => c.code === "TOP") || null;
    const salesCategory = categoriesInserted.find((c) => c.code === "SALES") || null;
    console.log("Категории созданы");
    // ------------------------------------
    // 4. Услуги (services)
    // ------------------------------------
    console.log("Создаём услуги...");
    const servicesData = [
        {
            name: "Подбор руководителей и топ-менеджмента",
            description: "Поиск и оценка директоров, руководителей подразделений и топ-менеджеров для компаний по всей России.",
            basePrice: "250000", // RUB как string
        },
        {
            name: "Подбор IT-специалистов",
            description: "Разработчики, тимлиды, проджекты, аналитики, DevOps-инженеры.",
            basePrice: "180000",
        },
        {
            name: "Массовый подбор персонала",
            description: "Ритейл, склады, логистика, производство — массовый подбор линейных сотрудников.",
            basePrice: "90000",
        },
    ];
    await db_1.db.insert(services_1.services).values(servicesData.map((s) => ({
        name: s.name,
        description: s.description,
        basePrice: s.basePrice,
        isActive: true,
    })));
    console.log("Услуги созданы");
    // ------------------------------------
    // 5. Тестовые заявки (requests)
    // ------------------------------------
    console.log("Создаём тестовые заявки...");
    await db_1.db.insert(requests_1.requests).values([
        {
            companyId,
            createdBy: clientId,
            assignedManager: adminId,
            positionTitle: "Руководитель отдела продаж",
            staffCategoryId: salesCategory ? salesCategory.id : null,
            experienceYears: "5.0",
            salaryFrom: "180000",
            salaryTo: "250000",
            currency: "RUB",
            description: "Запуск и развитие отдела продаж, постановка планов, управление командой из 10–15 менеджеров.",
            keyRequirements: "Опыт руководства продажами от 3 лет, знание B2B и B2C, умение работать с аналитикой и воронкой.",
            status: "NEW",
        },
        {
            companyId,
            createdBy: clientId,
            assignedManager: adminId,
            positionTitle: "Frontend-разработчик (React)",
            staffCategoryId: itCategory ? itCategory.id : null,
            experienceYears: "3.0",
            salaryFrom: "150000",
            salaryTo: "220000",
            currency: "RUB",
            description: "Разработка и поддержка фронтенда внутренней HR-платформы, работа с дизайн-системой, интеграции с API.",
            keyRequirements: "Опыт с React, TypeScript, Git, понимание UX, опыт работы в продуктовой команде.",
            status: "IN_PROGRESS",
        },
        {
            companyId,
            createdBy: clientId,
            assignedManager: adminId,
            positionTitle: "HR generalist",
            staffCategoryId: null,
            experienceYears: "2.0",
            salaryFrom: "90000",
            salaryTo: "130000",
            currency: "RUB",
            description: "Подбор, адаптация сотрудников, участие в HR-проектах, сопровождение сотрудников по HR-вопросам.",
            keyRequirements: "Опыт в HR от 2 лет, уверенные навыки интервью, знание базового трудового законодательства РФ.",
            status: "SOURCING",
        },
        {
            companyId,
            createdBy: clientId,
            assignedManager: adminId,
            positionTitle: "Операционный директор",
            staffCategoryId: topCategory ? topCategory.id : null,
            experienceYears: "7.0",
            salaryFrom: "250000",
            salaryTo: "350000",
            currency: "RUB",
            description: "Операционное управление компанией, развитие процессов, построение KPI, взаимодействие с собственниками.",
            keyRequirements: "Опыт на позиции операционного директора или генерального директора, стратегическое мышление, управленческий опыт.",
            status: "CLOSED",
        },
        {
            companyId,
            createdBy: clientId,
            assignedManager: null,
            positionTitle: "Менеджер по продажам",
            staffCategoryId: salesCategory ? salesCategory.id : null,
            experienceYears: "1.0",
            salaryFrom: "60000",
            salaryTo: "100000",
            currency: "RUB",
            description: "Активные продажи, работа с клиентской базой.",
            keyRequirements: "Опыт продаж от 1 года, коммуникабельность.",
            status: "DRAFT",
        },
    ]);
    console.log("Тестовые заявки созданы");
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
