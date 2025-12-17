// src/modules/adminClients/adminClient.routes.ts
import { Router } from "express";
import { adminClientController } from "./adminClient.controller";
import { authGuard } from "../../middlewares/authGuard";
import { roleGuard } from "../../middlewares/roleGuard";

const router = Router();

const onlyAdminOrManager = [authGuard, roleGuard(["admin", "manager"])];

router.get("/", ...onlyAdminOrManager, (req, res) => adminClientController.list(req, res));
router.get("/:id", ...onlyAdminOrManager, (req, res) => adminClientController.getById(req, res));

export default router;
