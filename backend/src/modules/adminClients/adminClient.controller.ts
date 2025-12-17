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
            if (err.message === "CLIENT_NOT_FOUND") {
                return res.status(404).json({ message: "Клиент не найден" });
            }
            console.error("Admin get client error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const adminClientController = new AdminClientController();
