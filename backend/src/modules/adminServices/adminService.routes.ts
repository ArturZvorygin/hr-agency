// src/modules/adminServices/adminService.routes.ts
import { Router } from "express";
import { authGuard } from "../../middlewares/authGuard";
import { adminServiceController } from "./adminService.controller";

const router = Router();

// Все маршруты защищены authGuard, внутри контроллера дополнительно проверяем role === 'admin'

// GET /api/admin/services
router.get("/", authGuard, (req, res) =>
    adminServiceController.list(req, res)
);

// POST /api/admin/services
router.post("/", authGuard, (req, res) =>
    adminServiceController.create(req, res)
);

// PUT /api/admin/services/:id
router.put("/:id", authGuard, (req, res) =>
    adminServiceController.update(req, res)
);

// DELETE /api/admin/services/:id
router.delete("/:id", authGuard, (req, res) =>
    adminServiceController.remove(req, res)
);

export default router;
