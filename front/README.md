# HR Agency Backend — «Наши люди»

Backend-часть дипломного проекта кадрового агентства «Наши люди».

Реализовано:
- регистрация и авторизация клиентов и админа (JWT, access токен);
- базовая модель данных: компании, пользователи, заявки (requests), категории персонала, услуги;
- публичная заявка на подбор персонала;
- клиентский кабинет (через API) для работы с заявками;
- админский доступ для проверки функционала (через API);
- миграции и сиды базы данных через Drizzle ORM.

---

## 1. Технологии

- **Node.js** 20+
- **TypeScript**
- **Express** 5
- **PostgreSQL** 14+
- **Drizzle ORM** (`drizzle-orm`, `drizzle-kit`)
- **JWT** (`jsonwebtoken`)
- Логирование: `morgan`
- Хеширование паролей: `bcryptjs`

---

## 2. Структура проекта (backend)

```bash
backend/
  src/
    server.ts          # Точка входа
    db/
      db.ts            # Подключение к Postgres + drizzle
      schema/
        users.ts
        companies.ts
        requests.ts
        staffCategories.ts
        services.ts
        refreshTokens.ts
      seed.ts          # Скрипт наполнения тестовыми данными
    modules/
      auth/            # Регистрация, логин, JWT
      requests/        # Работа с заявками
      dicts/           # Справочники (категории, услуги)
      # ... другие модули
  drizzle/             # Миграции, генерируемые drizzle-kit
  package.json
  drizzle.config.ts
  .env.example (рекомендуется создать)
