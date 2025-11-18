// src/modules/dict/dict.routes.ts
import { Router } from "express";
import { dictController } from "./dict.controller";

const router = Router();

// Публичный список категорий персонала
router.get("/staff-categories", (req, res) =>
    dictController.getStaffCategories(req, res)
);
router.get("/services", (req, res) =>
    dictController.getServices(req, res)
);
export default router;
