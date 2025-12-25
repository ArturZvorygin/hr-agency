"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/requestComments/requestComment.routes.ts
const express_1 = require("express");
const requestComment_controller_1 = require("./requestComment.controller");
const authGuard_1 = require("../../middlewares/authGuard");
const roleGuard_1 = require("../../middlewares/roleGuard");
const router = (0, express_1.Router)();
const onlyAdminOrManager = [authGuard_1.authGuard, (0, roleGuard_1.roleGuard)(["admin", "manager"])];
// Создать комментарий (только admin/manager)
router.post("/", ...onlyAdminOrManager, (req, res) => requestComment_controller_1.requestCommentController.create(req, res));
// Список комментариев по заявке (только admin/manager)
router.get("/request/:requestId", ...onlyAdminOrManager, (req, res) => requestComment_controller_1.requestCommentController.listByRequest(req, res));
exports.default = router;
