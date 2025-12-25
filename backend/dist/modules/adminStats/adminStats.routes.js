"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/adminStats/adminStats.routes.ts
const express_1 = require("express");
const adminStats_controller_1 = require("./adminStats.controller");
const authGuard_1 = require("../../middlewares/authGuard");
const roleGuard_1 = require("../../middlewares/roleGuard");
const router = (0, express_1.Router)();
// Статистика доступна admin и manager
const onlyAdminOrManager = [authGuard_1.authGuard, (0, roleGuard_1.roleGuard)(["admin", "manager"])];
router.get("/overview", ...onlyAdminOrManager, (req, res) => adminStats_controller_1.adminStatsController.getOverview(req, res));
exports.default = router;
