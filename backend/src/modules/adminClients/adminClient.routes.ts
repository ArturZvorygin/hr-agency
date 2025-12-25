// src/modules/adminClients/adminClient.routes.ts
import { Router } from "express";
import { adminClientController } from "./adminClient.controller";
import { authGuard } from "../../middlewares/authGuard";
import { roleGuard } from "../../middlewares/roleGuard";

const router = Router();

const onlyAdminOrManager = [authGuard, roleGuard(["admin", "manager"])];

router.get("/", ...onlyAdminOrManager, (req, res) => adminClientController.list(req, res));
router.get("/:id", ...onlyAdminOrManager, (req, res) => adminClientController.getById(req, res));
router.put("/:id", ...onlyAdminOrManager, (req, res) => adminClientController.update(req, res));
router.put("/:id/company", ...onlyAdminOrManager, (req, res) => adminClientController.updateCompany(req, res));
router.delete("/:id", ...onlyAdminOrManager, (req, res) => adminClientController.delete(req, res));
router.post("/:id/change-password", ...onlyAdminOrManager, (req, res) => adminClientController.changePassword(req, res));

export default router;
