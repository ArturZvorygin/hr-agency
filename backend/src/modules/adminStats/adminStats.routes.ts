// src/modules/adminStats/adminStats.routes.ts
import { Router } from "express";
import { adminStatsController } from "./adminStats.controller";
import { authGuard } from "../../middlewares/authGuard";
import { roleGuard } from "../../middlewares/roleGuard";

const router = Router();

// Статистика доступна admin и manager
const onlyAdminOrManager = [authGuard, roleGuard(["admin", "manager"])];

router.get("/overview", ...onlyAdminOrManager, (req, res) =>
    adminStatsController.getOverview(req, res)
);

export default router;
