// src/modules/adminCategories/adminCategory.routes.ts
import { Router } from "express";
import { adminCategoryController } from "./adminCategory.controller";
import { authGuard } from "../../middlewares/authGuard";
import { roleGuard } from "../../middlewares/roleGuard";

const router = Router();

const onlyAdmin = [authGuard, roleGuard(["admin"])];

// CRUD категорий
router.get("/", ...onlyAdmin, (req, res) => adminCategoryController.list(req, res));
router.get("/:id", ...onlyAdmin, (req, res) => adminCategoryController.getById(req, res));
router.post("/", ...onlyAdmin, (req, res) => adminCategoryController.create(req, res));
router.put("/:id", ...onlyAdmin, (req, res) => adminCategoryController.update(req, res));
router.delete("/:id", ...onlyAdmin, (req, res) => adminCategoryController.delete(req, res));

export default router;
