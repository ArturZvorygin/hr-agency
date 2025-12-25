"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminStatsService = void 0;
// src/modules/adminStats/adminStats.service.ts
const db_1 = require("../../db/db");
const requests_1 = require("../../db/schema/requests");
const companies_1 = require("../../db/schema/companies");
class AdminStatsService {
    async getOverview() {
        // Берём все заявки и компании
        const allRequests = await db_1.db.select().from(requests_1.requests);
        const allCompanies = await db_1.db.select().from(companies_1.companies);
        const totalRequests = allRequests.length;
        const totalCompanies = allCompanies.length;
        const byStatus = {};
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
exports.adminStatsService = new AdminStatsService();
