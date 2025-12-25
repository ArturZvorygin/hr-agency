"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminStatsController = void 0;
const adminStats_service_1 = require("./adminStats.service");
class AdminStatsController {
    async getOverview(req, res) {
        try {
            const stats = await adminStats_service_1.adminStatsService.getOverview();
            return res.status(200).json({ stats });
        }
        catch (err) {
            console.error("Admin stats overview error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.adminStatsController = new AdminStatsController();
