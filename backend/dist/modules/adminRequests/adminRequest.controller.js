"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRequestController = void 0;
const adminRequest_service_1 = require("./adminRequest.service");
class AdminRequestController {
    async list(req, res) {
        try {
            const { status } = req.query;
            const list = await adminRequest_service_1.adminRequestService.listAll(status);
            return res.status(200).json({ requests: list });
        }
        catch (err) {
            console.error("Admin list requests error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const item = await adminRequest_service_1.adminRequestService.getById(id);
            return res.status(200).json({ request: item });
        }
        catch (err) {
            if (err.message === "REQUEST_NOT_FOUND") {
                return res.status(404).json({ message: "Заявка не найдена" });
            }
            console.error("Admin get request error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async changeStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!status) {
                return res.status(400).json({ message: "Поле status обязательно" });
            }
            const updated = await adminRequest_service_1.adminRequestService.changeStatus(id, { status });
            return res.status(200).json({ request: updated });
        }
        catch (err) {
            if (err.message === "REQUEST_NOT_FOUND") {
                return res.status(404).json({ message: "Заявка не найдена" });
            }
            console.error("Admin change status error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // Опционально: заявки, назначенные на конкретного менеджера
    async listMyAssigned(req, res) {
        try {
            const current = req.user;
            const list = await adminRequest_service_1.adminRequestService.listAssignedToManager(current.userId);
            return res.status(200).json({ requests: list });
        }
        catch (err) {
            console.error("Admin list assigned error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // Назначить менеджера
    async assignManager(req, res) {
        try {
            const { id } = req.params;
            const { managerId } = req.body;
            if (!managerId) {
                return res.status(400).json({ message: "Поле managerId обязательно" });
            }
            const updated = await adminRequest_service_1.adminRequestService.assignManager(id, managerId);
            return res.status(200).json({ request: updated });
        }
        catch (err) {
            if (err.message === "REQUEST_NOT_FOUND") {
                return res.status(404).json({ message: "Заявка не найдена" });
            }
            console.error("Admin assign manager error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.adminRequestController = new AdminRequestController();
