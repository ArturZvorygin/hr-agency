// src/modules/adminRequests/adminRequest.routes.ts
import { Router } from "express";
import { adminRequestController } from "./adminRequest.controller";
import { authGuard } from "../../middlewares/authGuard";
import { roleGuard } from "../../middlewares/roleGuard";

const router = Router();

// Все эндпоинты только для admin и manager
const onlyAdminOrManager = [authGuard, roleGuard(["admin", "manager"])];

// Список всех заявок
router.get("/", ...onlyAdminOrManager, (req, res) =>
    adminRequestController.list(req, res)
);

// Одна заявка по id
router.get("/:id", ...onlyAdminOrManager, (req, res) =>
    adminRequestController.getById(req, res)
);

// Смена статуса заявки
router.patch("/:id/status", ...onlyAdminOrManager, (req, res) =>
    adminRequestController.changeStatus(req, res)
);

// Назначить менеджера
router.patch("/:id/assign", ...onlyAdminOrManager, (req, res) =>
    adminRequestController.assignManager(req, res)
);

// Опционально: заявки, назначенные текущему менеджеру
router.get("/me/assigned", ...onlyAdminOrManager, (req, res) =>
    adminRequestController.listMyAssigned(req, res)
);

export default router;
