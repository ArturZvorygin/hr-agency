// src/modules/companies/company.routes.ts
import { Router } from "express";
import { companyController } from "./company.controller";
import { authGuard } from "../../middlewares/authGuard";

const router = Router();

// Получить компанию текущего пользователя
router.get("/my", authGuard, (req, res) => companyController.getMy(req, res));

// Обновить компанию текущего пользователя
router.put("/my", authGuard, (req, res) => companyController.updateMy(req, res));

export default router;
