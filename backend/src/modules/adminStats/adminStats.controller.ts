// src/modules/adminStats/adminStats.controller.ts
import { Request, Response } from "express";
import { adminStatsService } from "./adminStats.service";

class AdminStatsController {
    async getOverview(req: Request, res: Response) {
        try {
            const stats = await adminStatsService.getOverview();
            return res.status(200).json({ stats });
        } catch (err) {
            console.error("Admin stats overview error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const adminStatsController = new AdminStatsController();
