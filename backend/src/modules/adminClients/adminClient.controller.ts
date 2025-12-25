// src/modules/adminClients/adminClient.controller.ts
import { Request, Response } from "express";
import { adminClientService } from "./adminClient.service";

class AdminClientController {
    async list(req: Request, res: Response) {
        try {
            const list = await adminClientService.listAllClients();
            return res.status(200).json({ clients: list });
        } catch (err) {
            console.error("Admin list clients error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const item = await adminClientService.getClientById(id);
            return res.status(200).json({ client: item });
        } catch (err: any) {
            if (err?.message === "CLIENT_NOT_FOUND") {
                return res.status(404).json({ message: "Клиент не найден" });
            }
            console.error("Admin get client error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { email, firstName, lastName, phone, isActive } = req.body;

            const updated = await adminClientService.updateClient(id, {
                email,
                firstName,
                lastName,
                phone,
                isActive,
            });

            return res.status(200).json({ client: updated });
        } catch (err: any) {
            if (err?.message === "CLIENT_NOT_FOUND") {
                return res.status(404).json({ message: "Клиент не найден" });
            }
            console.error("Admin update client error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async updateCompany(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, email, phone, website, description, industry, size } = req.body;

            const updated = await adminClientService.updateClientCompany(id, {
                name,
                email,
                phone,
                website,
                description,
                industry,
                size,
            });

            return res.status(200).json({ client: updated });
        } catch (err: any) {
            if (err?.message === "CLIENT_NOT_FOUND") {
                return res.status(404).json({ message: "Клиент не найден" });
            }
            if (err?.message === "CLIENT_HAS_NO_COMPANY") {
                return res.status(400).json({ message: "У клиента нет компании" });
            }
            console.error("Admin update client company error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // ✅ правильное удаление: контроллер НЕ трогает db, только вызывает service
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            await adminClientService.deleteClient(id);

            return res.status(200).json({ message: "Клиент удален" });
        } catch (err: any) {
            if (err?.message === "CLIENT_NOT_FOUND") {
                return res.status(404).json({ message: "Клиент не найден" });
            }
            console.error("Admin delete client error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async changePassword(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { newPassword } = req.body;

            if (!newPassword || String(newPassword).length < 6) {
                return res.status(400).json({ message: "Пароль должен быть не менее 6 символов" });
            }

            await adminClientService.changeClientPassword(id, newPassword);

            return res.status(200).json({ message: "Пароль изменен" });
        } catch (err: any) {
            if (err?.message === "CLIENT_NOT_FOUND") {
                return res.status(404).json({ message: "Клиент не найден" });
            }
            if (err?.message === "PASSWORD_TOO_SHORT") {
                return res.status(400).json({ message: "Пароль должен быть не менее 6 символов" });
            }
            console.error("Admin change client password error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const adminClientController = new AdminClientController();
