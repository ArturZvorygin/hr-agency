"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/requests/request.routes.ts
const express_1 = require("express");
const request_controller_1 = require("./request.controller");
const authGuard_1 = require("../../middlewares/authGuard");
const router = (0, express_1.Router)();
// Создать заявку
router.post("/", authGuard_1.authGuard, (req, res) => request_controller_1.requestController.create(req, res));
// Список заявок текущей компании
router.get("/my", authGuard_1.authGuard, (req, res) => request_controller_1.requestController.listMy(req, res));
// Детали одной заявки (если принадлежит компании пользователя)
router.get("/:id", authGuard_1.authGuard, (req, res) => request_controller_1.requestController.getMyById(req, res));
exports.default = router;
