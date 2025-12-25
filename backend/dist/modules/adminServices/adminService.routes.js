"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/adminServices/adminService.routes.ts
const express_1 = require("express");
const authGuard_1 = require("../../middlewares/authGuard");
const adminService_controller_1 = require("./adminService.controller");
const router = (0, express_1.Router)();
// Все маршруты защищены authGuard, внутри контроллера дополнительно проверяем role === 'admin'
// GET /api/admin/services
router.get("/", authGuard_1.authGuard, (req, res) => adminService_controller_1.adminServiceController.list(req, res));
// POST /api/admin/services
router.post("/", authGuard_1.authGuard, (req, res) => adminService_controller_1.adminServiceController.create(req, res));
// PUT /api/admin/services/:id
router.put("/:id", authGuard_1.authGuard, (req, res) => adminService_controller_1.adminServiceController.update(req, res));
// DELETE /api/admin/services/:id
router.delete("/:id", authGuard_1.authGuard, (req, res) => adminService_controller_1.adminServiceController.remove(req, res));
exports.default = router;
