// src/modules/adminServices/adminService.routes.ts
import { Router } from "express";
import { adminServiceController } from "./adminService.controller";
import { authGuard } from "../../middlewares/authGuard";
import { roleGuard } from "../../middlewares/roleGuard";

const router = Router();

// Только для admin (менеджерам это не обязательно)
const onlyAdmin = [authGuard, roleGuard(["admin"])];

router.post("/", ...onlyAdmin, (req, res) =>
    adminServiceController.create(req, res)
);

router.put("/:id", ...onlyAdmin, (req, res) =>
    adminServiceController.update(req, res)
);

router.delete("/:id", ...onlyAdmin, (req, res) =>
    adminServiceController.delete(req, res)
);

export default router;
