"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCategoryController = void 0;
const adminCategory_service_1 = require("./adminCategory.service");
class AdminCategoryController {
    async list(req, res) {
        try {
            const list = await adminCategory_service_1.adminCategoryService.listAll();
            return res.status(200).json({ categories: list });
        }
        catch (err) {
            console.error("Admin list categories error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const item = await adminCategory_service_1.adminCategoryService.getById(Number(id));
            return res.status(200).json({ category: item });
        }
        catch (err) {
            if (err.message === "CATEGORY_NOT_FOUND") {
                return res.status(404).json({ message: "Категория не найдена" });
            }
            console.error("Admin get category error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async create(req, res) {
        try {
            const { code, name, description } = req.body;
            if (!code || !name) {
                return res.status(400).json({ message: "Поля code и name обязательны" });
            }
            const created = await adminCategory_service_1.adminCategoryService.create({ code, name, description });
            return res.status(201).json({ category: created });
        }
        catch (err) {
            console.error("Admin create category error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { code, name, description } = req.body;
            const updated = await adminCategory_service_1.adminCategoryService.update(Number(id), { code, name, description });
            return res.status(200).json({ category: updated });
        }
        catch (err) {
            if (err.message === "CATEGORY_NOT_FOUND") {
                return res.status(404).json({ message: "Категория не найдена" });
            }
            console.error("Admin update category error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            await adminCategory_service_1.adminCategoryService.delete(Number(id));
            return res.status(200).json({ message: "Категория удалена" });
        }
        catch (err) {
            if (err.message === "CATEGORY_NOT_FOUND") {
                return res.status(404).json({ message: "Категория не найдена" });
            }
            console.error("Admin delete category error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.adminCategoryController = new AdminCategoryController();
