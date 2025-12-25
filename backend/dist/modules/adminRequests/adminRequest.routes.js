"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/adminRequests/adminRequest.routes.ts
const express_1 = require("express");
const adminRequest_controller_1 = require("./adminRequest.controller");
const authGuard_1 = require("../../middlewares/authGuard");
const roleGuard_1 = require("../../middlewares/roleGuard");
const router = (0, express_1.Router)();
// Все эндпоинты только для admin и manager
const onlyAdminOrManager = [authGuard_1.authGuard, (0, roleGuard_1.roleGuard)(["admin", "manager"])];
// Список всех заявок
router.get("/", ...onlyAdminOrManager, (req, res) => adminRequest_controller_1.adminRequestController.list(req, res));
// Одна заявка по id
router.get("/:id", ...onlyAdminOrManager, (req, res) => adminRequest_controller_1.adminRequestController.getById(req, res));
// Смена статуса заявки
router.patch("/:id/status", ...onlyAdminOrManager, (req, res) => adminRequest_controller_1.adminRequestController.changeStatus(req, res));
// Назначить менеджера
router.patch("/:id/assign", ...onlyAdminOrManager, (req, res) => adminRequest_controller_1.adminRequestController.assignManager(req, res));
// Опционально: заявки, назначенные текущему менеджеру
router.get("/me/assigned", ...onlyAdminOrManager, (req, res) => adminRequest_controller_1.adminRequestController.listMyAssigned(req, res));
exports.default = router;
