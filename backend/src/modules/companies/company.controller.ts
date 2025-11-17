// src/modules/companies/company.controller.ts
import { Request, Response } from "express";
import { companyService } from "./company.service";

class CompanyController {
    async getMy(req: Request, res: Response) {
        try {
            const current = (req as any).user;

            if (!current || !current.userId) {
                return res.status(401).json({ message: "Требуется авторизация" });
            }

            const company = await companyService.getMyCompany(current.userId);

            return res.status(200).json({ company });
        } catch (err: any) {
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

    async updateMy(req: Request, res: Response) {
        try {
            const current = (req as any).user;

            if (!current || !current.userId) {
                return res.status(401).json({ message: "Требуется авторизация" });
            }

            const updated = await companyService.updateMyCompany(current.userId, req.body);

            return res.status(200).json({ company: updated });
        } catch (err: any) {
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

export const companyController = new CompanyController();
