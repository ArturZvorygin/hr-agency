"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/adminClients/adminClient.routes.ts
const express_1 = require("express");
const adminClient_controller_1 = require("./adminClient.controller");
const authGuard_1 = require("../../middlewares/authGuard");
const roleGuard_1 = require("../../middlewares/roleGuard");
const router = (0, express_1.Router)();
const onlyAdminOrManager = [authGuard_1.authGuard, (0, roleGuard_1.roleGuard)(["admin", "manager"])];
router.get("/", ...onlyAdminOrManager, (req, res) => adminClient_controller_1.adminClientController.list(req, res));
router.get("/:id", ...onlyAdminOrManager, (req, res) => adminClient_controller_1.adminClientController.getById(req, res));
router.put("/:id", ...onlyAdminOrManager, (req, res) => adminClient_controller_1.adminClientController.update(req, res));
router.put("/:id/company", ...onlyAdminOrManager, (req, res) => adminClient_controller_1.adminClientController.updateCompany(req, res));
router.delete("/:id", ...onlyAdminOrManager, (req, res) => adminClient_controller_1.adminClientController.delete(req, res));
router.post("/:id/change-password", ...onlyAdminOrManager, (req, res) => adminClient_controller_1.adminClientController.changePassword(req, res));
exports.default = router;
