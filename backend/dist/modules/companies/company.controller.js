"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyController = void 0;
const company_service_1 = require("./company.service");
class CompanyController {
    async getMy(req, res) {
        try {
            const current = req.user;
            if (!current || !current.userId) {
                return res.status(401).json({ message: "Требуется авторизация" });
            }
            const company = await company_service_1.companyService.getMyCompany(current.userId);
            return res.status(200).json({ company });
        }
        catch (err) {
            if (err.message === "USER_NOT_FOUND") {
                return res.status(404).json({ message: "Пользователь не найден" });
            }
            if (err.message === "COMPANY_NOT_ASSIGNED") {
                return res.status(400).json({ message: "У пользователя не привязана компания" });
            }
            if (err.message === "COMPANY_NOT_FOUND") {
                return res.status(404).json({ message: "Компания не найдена" });
            }
            console.error("getMyCompany error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async updateMy(req, res) {
        try {
            const current = req.user;
            if (!current || !current.userId) {
                return res.status(401).json({ message: "Требуется авторизация" });
            }
            const updated = await company_service_1.companyService.updateMyCompany(current.userId, req.body);
            return res.status(200).json({ company: updated });
        }
        catch (err) {
            if (err.message === "USER_NOT_FOUND") {
                return res.status(404).json({ message: "Пользователь не найден" });
            }
            if (err.message === "COMPANY_NOT_ASSIGNED") {
                return res.status(400).json({ message: "У пользователя не привязана компания" });
            }
            if (err.message === "COMPANY_NOT_FOUND") {
                return res.status(404).json({ message: "Компания не найдена" });
            }
            console.error("updateMyCompany error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.companyController = new CompanyController();
