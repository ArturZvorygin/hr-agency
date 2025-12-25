"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminClientController = void 0;
const adminClient_service_1 = require("./adminClient.service");
class AdminClientController {
    async list(req, res) {
        try {
            const list = await adminClient_service_1.adminClientService.listAllClients();
            return res.status(200).json({ clients: list });
        }
        catch (err) {
            console.error("Admin list clients error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const item = await adminClient_service_1.adminClientService.getClientById(id);
            return res.status(200).json({ client: item });
        }
        catch (err) {
            if (err.message === "CLIENT_NOT_FOUND") {
                return res.status(404).json({ message: "Клиент не найден" });
            }
            console.error("Admin get client error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.adminClientController = new AdminClientController();
