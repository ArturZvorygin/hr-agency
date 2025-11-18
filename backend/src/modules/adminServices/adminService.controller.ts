// src/modules/adminServices/adminService.controller.ts
import { Request, Response } from "express";
import { adminServiceService } from "./adminService.service";

class AdminServiceController {
    async create(req: Request, res: Response) {
        try {
            const { name, description, basePrice, isActive } = req.body;

            if (!name) {
                return res.status(400).json({ message: "Поле name обязательно" });
            }

            const created = await adminServiceService.create({
                name,
                description,
                basePrice,
                isActive
            });

            return res.status(201).json({ service: created });
        } catch (err) {
            console.error("Admin create service error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ message: "Некорректный id" });
            }

            const { name, description, basePrice, isActive } = req.body;

            if (!name) {
                return res.status(400).json({ message: "Поле name обязательно" });
            }

            const updated = await adminServiceService.update(id, {
                name,
                description,
                basePrice,
                isActive
            });

            return res.status(200).json({ service: updated });
        } catch (err: any) {
            if (err.message === "SERVICE_NOT_FOUND") {
                return res.status(404).json({ message: "Услуга не найдена" });
            }
            console.error("Admin update service error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ message: "Некорректный id" });
            }

            const deleted = await adminServiceService.delete(id);

            return res.status(200).json({ service: deleted });
        } catch (err: any) {
            if (err.message === "SERVICE_NOT_FOUND") {
                return res.status(404).json({ message: "Услуга не найдена" });
            }
            console.error("Admin delete service error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const adminServiceController = new AdminServiceController();
