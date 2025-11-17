// src/modules/requests/request.routes.ts
import { Router } from "express";
import { requestController } from "./request.controller";
import { authGuard } from "../../middlewares/authGuard";

const router = Router();

// Создать заявку
router.post("/", authGuard, (req, res) => requestController.create(req, res));

// Список заявок текущей компании
router.get("/my", authGuard, (req, res) => requestController.listMy(req, res));

// Детали одной заявки (если принадлежит компании пользователя)
router.get("/:id", authGuard, (req, res) => requestController.getMyById(req, res));

export default router;
