// src/modules/requestComments/requestComment.routes.ts
import { Router } from "express";
import { requestCommentController } from "./requestComment.controller";
import { authGuard } from "../../middlewares/authGuard";
import { roleGuard } from "../../middlewares/roleGuard";

const router = Router();

const onlyAdminOrManager = [authGuard, roleGuard(["admin", "manager"])];

// Создать комментарий (только admin/manager)
router.post("/", ...onlyAdminOrManager, (req, res) =>
    requestCommentController.create(req, res)
);

// Список комментариев по заявке (только admin/manager)
router.get("/request/:requestId", ...onlyAdminOrManager, (req, res) =>
    requestCommentController.listByRequest(req, res)
);

export default router;
