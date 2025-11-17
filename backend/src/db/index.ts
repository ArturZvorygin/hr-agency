// src/db.ts
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

// Импорт схем
import * as usersSchema from "./schema/users";
import * as companiesSchema from "./schema/companies";
// сюда потом добавишь остальные схемы (requests, tokens и т.д.)

// Жёсткая конфигурация подключения для диплома
const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "nargiz",      // твой системный пользователь
    database: "hr_agency" // НУЖНАЯ нам база
    // без пароля — для локальной разработки это нормально
});

export const db = drizzle(pool, {
    schema: {
        ...usersSchema,
        ...companiesSchema
        // сюда добавишь остальные схемы, когда создадим
    }
});
