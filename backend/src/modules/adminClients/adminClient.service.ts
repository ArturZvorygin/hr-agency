// src/modules/adminClients/adminClient.service.ts
import { db } from "../../db/db";
import { users } from "../../db/schema/users";
import { companies } from "../../db/schema/companies";
import { eq } from "drizzle-orm";

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
            })
            .from(users)
            .leftJoin(companies, eq(users.companyId, companies.id))
            .where(eq(users.id, id))
            .limit(1);

        if (!item) {
            throw new Error("CLIENT_NOT_FOUND");
        }

        return item;
    }
}

export const adminClientService = new AdminClientService();
