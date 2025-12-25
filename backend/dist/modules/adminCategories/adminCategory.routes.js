"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/adminCategories/adminCategory.routes.ts
const express_1 = require("express");
const adminCategory_controller_1 = require("./adminCategory.controller");
const authGuard_1 = require("../../middlewares/authGuard");
const roleGuard_1 = require("../../middlewares/roleGuard");
const router = (0, express_1.Router)();
const onlyAdmin = [authGuard_1.authGuard, (0, roleGuard_1.roleGuard)(["admin"])];
// CRUD категорий
router.get("/", ...onlyAdmin, (req, res) => adminCategory_controller_1.adminCategoryController.list(req, res));
router.get("/:id", ...onlyAdmin, (req, res) => adminCategory_controller_1.adminCategoryController.getById(req, res));
router.post("/", ...onlyAdmin, (req, res) => adminCategory_controller_1.adminCategoryController.create(req, res));
router.put("/:id", ...onlyAdmin, (req, res) => adminCategory_controller_1.adminCategoryController.update(req, res));
router.delete("/:id", ...onlyAdmin, (req, res) => adminCategory_controller_1.adminCategoryController.delete(req, res));
exports.default = router;
