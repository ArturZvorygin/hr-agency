"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/companies/company.routes.ts
const express_1 = require("express");
const company_controller_1 = require("./company.controller");
const authGuard_1 = require("../../middlewares/authGuard");
const router = (0, express_1.Router)();
// Получить компанию текущего пользователя
router.get("/my", authGuard_1.authGuard, (req, res) => company_controller_1.companyController.getMy(req, res));
// Обновить компанию текущего пользователя
router.put("/my", authGuard_1.authGuard, (req, res) => company_controller_1.companyController.updateMy(req, res));
exports.default = router;
