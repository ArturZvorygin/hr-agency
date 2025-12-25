// src/modules/adminRequests/adminRequest.controller.ts
import { Request, Response } from "express";
import { adminRequestService } from "./adminRequest.service";

class AdminRequestController {
    async list(req: Request, res: Response) {
        try {
            const { status } = req.query;
            const list = await adminRequestService.listAll(status as string);
            return res.status(200).json({ requests: list });
        } catch (err) {
            console.error("Admin list requests error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const item = await adminRequestService.getById(id);
            return res.status(200).json({ request: item });
        } catch (err: any) {
            if (err.message === "REQUEST_NOT_FOUND") {
                return res.status(404).json({ message: "Заявка не найдена" });
            }
            console.error("Admin get request error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async changeStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ message: "Поле status обязательно" });
            }

            const updated = await adminRequestService.changeStatus(id, { status });

            return res.status(200).json({ request: updated });
        } catch (err: any) {
            if (err.message === "REQUEST_NOT_FOUND") {
                return res.status(404).json({ message: "Заявка не найдена" });
            }
            console.error("Admin change status error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Опционально: заявки, назначенные на конкретного менеджера
    async listMyAssigned(req: Request, res: Response) {
        try {
            const current = (req as any).user;
            const list = await adminRequestService.listAssignedToManager(current.userId);
            return res.status(200).json({ requests: list });
        } catch (err) {
            console.error("Admin list assigned error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Назначить менеджера
    async assignManager(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { managerId } = req.body;

            if (!managerId) {
                return res.status(400).json({ message: "Поле managerId обязательно" });
            }

            const updated = await adminRequestService.assignManager(id, managerId);
            return res.status(200).json({ request: updated });
        } catch (err: any) {
            if (err.message === "REQUEST_NOT_FOUND") {
                return res.status(404).json({ message: "Заявка не найдена" });
            }
            console.error("Admin assign manager error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const {
                positionTitle,
                staffCategoryId,
                experienceYears,
                salaryFrom,
                salaryTo,
                currency,
                description,
                keyRequirements,
                status,
            } = req.body;

            const updated = await adminRequestService.updateRequest(id, {
                positionTitle,
                staffCategoryId,
                experienceYears,
                salaryFrom,
                salaryTo,
                currency,
                description,
                keyRequirements,
                status,
            });

            return res.status(200).json({ request: updated });
        } catch (err: any) {
            if (err.message === "REQUEST_NOT_FOUND") {
                return res.status(404).json({ message: "Заявка не найдена" });
            }
            console.error("Admin update request error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await adminRequestService.deleteRequest(id);
            return res.status(200).json({ message: "Заявка удалена" });
        } catch (err: any) {
            if (err.message === "REQUEST_NOT_FOUND") {
                return res.status(404).json({ message: "Заявка не найдена" });
            }
            console.error("Admin delete request error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const adminRequestController = new AdminRequestController();
