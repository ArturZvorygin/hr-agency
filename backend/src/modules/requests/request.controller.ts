// src/modules/requests/request.controller.ts
import { Request, Response } from "express";
import { requestService } from "./request.service";

class RequestController {
    async create(req: Request, res: Response) {
        try {
            const current = (req as any).user;

            if (!current || !current.userId) {
                return res.status(401).json({ message: "Требуется авторизация" });
            }

            const { positionTitle, staffCategoryId, experienceYears, salaryFrom, salaryTo, currency, description, keyRequirements } = req.body;

            if (!positionTitle) {
                return res.status(400).json({ message: "Поле positionTitle обязательно" });
            }

            const created = await requestService.createRequest(current.userId, {
                positionTitle,
                staffCategoryId,
                experienceYears,
                salaryFrom,
                salaryTo,
                currency,
                description,
                keyRequirements
            });

            return res.status(201).json({ request: created });
        } catch (err: any) {
            if (err.message === "USER_NOT_FOUND") {
                return res.status(404).json({ message: "Пользователь не найден" });
            }
            if (err.message === "COMPANY_NOT_ASSIGNED") {
                return res.status(400).json({ message: "У пользователя не привязана компания" });
            }
            console.error("Create request error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async listMy(req: Request, res: Response) {
        try {
            const current = (req as any).user;

            if (!current || !current.userId) {
                return res.status(401).json({ message: "Требуется авторизация" });
            }

            const list = await requestService.listMyRequests(current.userId);

            return res.status(200).json({ requests: list });
        } catch (err: any) {
            if (err.message === "USER_NOT_FOUND") {
                return res.status(404).json({ message: "Пользователь не найден" });
            }
            if (err.message === "COMPANY_NOT_ASSIGNED") {
                return res.status(400).json({ message: "У пользователя не привязана компания" });
            }
            console.error("List my requests error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getMyById(req: Request, res: Response) {
        try {
            const current = (req as any).user;

            if (!current || !current.userId) {
                return res.status(401).json({ message: "Требуется авторизация" });
            }

            const { id } = req.params;

            const item = await requestService.getMyRequestById(current.userId, id);

            return res.status(200).json({ request: item });
        } catch (err: any) {
            if (err.message === "USER_NOT_FOUND") {
                return res.status(404).json({ message: "Пользователь не найден" });
            }
            if (err.message === "COMPANY_NOT_ASSIGNED") {
                return res.status(400).json({ message: "У пользователя не привязана компания" });
            }
            if (err.message === "REQUEST_NOT_FOUND") {
                return res.status(404).json({ message: "Заявка не найдена" });
            }
            console.error("Get my request error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const requestController = new RequestController();
