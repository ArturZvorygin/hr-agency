// src/modules/adminCategories/adminCategory.controller.ts
import { Request, Response } from "express";
import { adminCategoryService } from "./adminCategory.service";

class AdminCategoryController {
    async list(req: Request, res: Response) {
        try {
            const list = await adminCategoryService.listAll();
            return res.status(200).json({ categories: list });
        } catch (err) {
            console.error("Admin list categories error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const item = await adminCategoryService.getById(Number(id));
            return res.status(200).json({ category: item });
        } catch (err: any) {
            if (err.message === "CATEGORY_NOT_FOUND") {
                return res.status(404).json({ message: "Категория не найдена" });
            }
            console.error("Admin get category error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const { code, name, description } = req.body;

            if (!code || !name) {
                return res.status(400).json({ message: "Поля code и name обязательны" });
            }

            const created = await adminCategoryService.create({ code, name, description });
            return res.status(201).json({ category: created });
        } catch (err) {
            console.error("Admin create category error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { code, name, description } = req.body;

            const updated = await adminCategoryService.update(Number(id), { code, name, description });
            return res.status(200).json({ category: updated });
        } catch (err: any) {
            if (err.message === "CATEGORY_NOT_FOUND") {
                return res.status(404).json({ message: "Категория не найдена" });
            }
            console.error("Admin update category error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await adminCategoryService.delete(Number(id));
            return res.status(200).json({ message: "Категория удалена" });
        } catch (err: any) {
            if (err.message === "CATEGORY_NOT_FOUND") {
                return res.status(404).json({ message: "Категория не найдена" });
            }
            console.error("Admin delete category error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const adminCategoryController = new AdminCategoryController();
