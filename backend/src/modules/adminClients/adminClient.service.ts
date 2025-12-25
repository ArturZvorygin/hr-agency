// src/modules/adminClients/adminClient.service.ts
import { db } from "../../db/db";
import { users } from "../../db/schema/users";
import { companies } from "../../db/schema/companies";
import { requests } from "../../db/schema/requests"; // ✅ добавь (если файл так называется)
import { and, eq, sql } from "drizzle-orm";
import { hashPassword } from "../../utils/password";

function cleanUndefined<T extends Record<string, any>>(obj: T) {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
}

class AdminClientService {
    async listAllClients() {
        const list = await db
            .select({
                id: users.id,
                email: users.email,
                firstName: users.firstName,
                lastName: users.lastName,
                phone: users.phone,
                role: users.role,
                companyId: users.companyId,
                isActive: users.isActive,
                createdAt: users.createdAt,

                companyName: companies.name,
                companyEmail: companies.email,
                companyPhone: companies.phone,
                companyWebsite: companies.website,
                companyDescription: companies.description,
                companyIndustry: companies.industry,
                companySize: companies.size,
            })
            .from(users)
            .leftJoin(companies, eq(users.companyId, companies.id))
            .where(eq(users.role, "client"));

        return list;
    }

    async getClientById(id: string) {
        const [item] = await db
            .select({
                id: users.id,
                email: users.email,
                firstName: users.firstName,
                lastName: users.lastName,
                phone: users.phone,
                role: users.role,
                companyId: users.companyId,
                isActive: users.isActive,
                createdAt: users.createdAt,

                companyName: companies.name,
                companyEmail: companies.email,
                companyPhone: companies.phone,
                companyWebsite: companies.website,
                companyDescription: companies.description,
                companyIndustry: companies.industry,
                companySize: companies.size,
            })
            .from(users)
            .leftJoin(companies, eq(users.companyId, companies.id))
            .where(eq(users.id, id))
            .limit(1);

        if (!item) throw new Error("CLIENT_NOT_FOUND");
        return item;
    }

    async updateClient(
        id: string,
        data: {
            email?: string;
            firstName?: string;
            lastName?: string;
            phone?: string;
            isActive?: boolean;
        }
    ) {
        // ✅ защищаемся от случайного апдейта не-клиента
        const [exists] = await db
            .select({ id: users.id })
            .from(users)
            .where(and(eq(users.id, id), eq(users.role, "client")))
            .limit(1);

        if (!exists) throw new Error("CLIENT_NOT_FOUND");

        const patch = cleanUndefined({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            isActive: data.isActive,
            updatedAt: new Date(),
        });

        await db.update(users).set(patch).where(eq(users.id, id));
        return this.getClientById(id);
    }

    async updateClientCompany(
        clientId: string,
        companyData: {
            name?: string;
            email?: string;
            phone?: string;
            website?: string;
            description?: string;
            industry?: string;
            size?: string;
        }
    ) {
        const client = await this.getClientById(clientId);

        if (!client.companyId) {
            throw new Error("CLIENT_HAS_NO_COMPANY");
        }

        const patch = cleanUndefined({
            name: companyData.name,
            email: companyData.email,
            phone: companyData.phone,
            website: companyData.website,
            description: companyData.description,
            industry: companyData.industry,
            size: companyData.size,
            updatedAt: new Date(),
        });

        await db.update(companies).set(patch).where(eq(companies.id, client.companyId));
        return this.getClientById(clientId);
    }

    // ✅ КАСКАДНОЕ УДАЛЕНИЕ: requests -> user -> (опц) company
    async deleteClient(userId: string) {
        return db.transaction(async (tx) => {
            // 1) проверяем, что это client
            const [client] = await tx
                .select({ id: users.id, role: users.role, companyId: users.companyId })
                .from(users)
                .where(eq(users.id, userId))
                .limit(1);

            if (!client) throw new Error("CLIENT_NOT_FOUND");
            if (String(client.role) !== "client") throw new Error("CLIENT_NOT_FOUND");

            // 2) удаляем все заявки клиента (FK requests_created_by_users_id_fk)
            // ⚠️ По названию constraint у тебя поле именно created_by
            await tx.execute(sql`DELETE FROM "requests" WHERE "created_by" = ${userId}`);

            // (если у тебя есть связанные таблицы по requests — comments/candidates/etc — их тоже удаляй ДО requests)

            // 3) удаляем пользователя
            const [deleted] = await tx
                .delete(users)
                .where(eq(users.id, userId))
                .returning({ id: users.id });

            if (!deleted) throw new Error("CLIENT_NOT_FOUND");

            // 4) опционально удаляем компанию, если в ней больше никого нет
            const companyId = client.companyId;
            if (companyId) {
                const [{ cnt }] = await tx
                    .select({ cnt: sql<number>`count(*)` })
                    .from(users)
                    .where(eq(users.companyId, companyId));

                if (Number(cnt) === 0) {
                    await tx.delete(companies).where(eq(companies.id, companyId));
                }
            }

            return { id: deleted.id };
        });
    }

    async changeClientPassword(id: string, newPassword: string) {
        if (!newPassword || String(newPassword).length < 6) {
            throw new Error("PASSWORD_TOO_SHORT");
        }

        // ✅ защищаемся от смены пароля не-клиента
        const [exists] = await db
            .select({ id: users.id })
            .from(users)
            .where(and(eq(users.id, id), eq(users.role, "client")))
            .limit(1);

        if (!exists) throw new Error("CLIENT_NOT_FOUND");

        const passwordHash = await hashPassword(newPassword);

        await db
            .update(users)
            .set({
                passwordHash,
                updatedAt: new Date(),
            })
            .where(eq(users.id, id));

        return { ok: true };
    }
}

export const adminClientService = new AdminClientService();
