// src/modules/requestComments/requestComment.controller.ts
import { Request, Response } from "express";
import { requestCommentService } from "./requestComment.service";

class RequestCommentController {
    async create(req: Request, res: Response) {
        try {
            const current = (req as any).user;

            if (!current || !current.userId) {
                return res.status(401).json({ message: "Требуется авторизация" });
            }

            const { requestId, text } = req.body;

            if (!requestId || !text) {
                return res.status(400).json({ message: "Поля requestId и text обязательны" });
            }

            const created = await requestCommentService.createComment({
                requestId,
                authorId: current.userId,
                text
            });

            return res.status(201).json({ comment: created });
        } catch (err) {
            console.error("Create comment error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async listByRequest(req: Request, res: Response) {
        try {
            const { requestId } = req.params;

            const list = await requestCommentService.listByRequestId(requestId);

            return res.status(200).json({ comments: list });
        } catch (err) {
            console.error("List comments error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const requestCommentController = new RequestCommentController();
