// src/modules/adminStats/adminStats.service.ts
import { db } from "../../db/db";
import { requests } from "../../db/schema/requests";
import { companies } from "../../db/schema/companies";

type OverviewStats = {
    totalRequests: number;
    totalCompanies: number;
    byStatus: Record<string, number>;
};

class AdminStatsService {
    async getOverview(): Promise<OverviewStats> {
        // Берём все заявки и компании
        const allRequests = await db.select().from(requests);
        const allCompanies = await db.select().from(companies);

        const totalRequests = allRequests.length;
        const totalCompanies = allCompanies.length;

        const byStatus: Record<string, number> = {};

        for (const r of allRequests) {
            const status = r.status || "unknown";
            byStatus[status] = (byStatus[status] || 0) + 1;
        }

        return {
            totalRequests,
            totalCompanies,
            byStatus
        };
    }
}

export const adminStatsService = new AdminStatsService();
