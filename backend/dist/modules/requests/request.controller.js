"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestController = void 0;
const request_service_1 = require("./request.service");
class RequestController {
    async create(req, res) {
        try {
            const current = req.user;
            if (!current || !current.userId) {
                return res.status(401).json({ message: "Требуется авторизация" });
            }
            const { positionTitle, staffCategoryId, experienceYears, salaryFrom, salaryTo, currency, description, keyRequirements, isDraft } = req.body;
            if (!positionTitle) {
                return res.status(400).json({ message: "Поле positionTitle обязательно" });
            }
            const created = await request_service_1.requestService.createRequest(current.userId, {
                positionTitle,
                staffCategoryId,
                experienceYears,
                salaryFrom,
                salaryTo,
                currency,
                description,
                keyRequirements,
                isDraft
            });
            return res.status(201).json({ request: created });
        }
        catch (err) {
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
    async listMy(req, res) {
        try {
            const current = req.user;
            if (!current || !current.userId) {
                return res.status(401).json({ message: "Требуется авторизация" });
            }
            const { status } = req.query;
            const list = await request_service_1.requestService.listMyRequests(current.userId, status);
            return res.status(200).json({ requests: list });
        }
        catch (err) {
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
    async getMyById(req, res) {
        try {
            const current = req.user;
            if (!current || !current.userId) {
                return res.status(401).json({ message: "Требуется авторизация" });
            }
            const { id } = req.params;
            const item = await request_service_1.requestService.getMyRequestById(current.userId, id);
            return res.status(200).json({ request: item });
        }
        catch (err) {
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
exports.requestController = new RequestController();
