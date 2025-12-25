"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminServiceController = void 0;
const db_1 = require("../../db/db");
const services_1 = require("../../db/schema/services");
const drizzle_orm_1 = require("drizzle-orm");
class AdminServiceController {
    ensureAdmin(req, res) {
        const current = req.user;
        if (!current || !current.userId) {
            res.status(401).json({ message: "Требуется авторизация" });
            return null;
        }
        if (current.role !== "admin") {
            res.status(403).json({ message: "Недостаточно прав" });
            return null;
        }
        return current;
    }
    // GET /api/admin/services
    async list(req, res) {
        try {
            if (!this.ensureAdmin(req, res))
                return;
            const rows = await db_1.db
                .select()
                .from(services_1.services)
                .orderBy(services_1.services.name);
            return res.status(200).json({ services: rows });
        }
        catch (err) {
            console.error("Admin services list error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // POST /api/admin/services
    async create(req, res) {
        try {
            if (!this.ensureAdmin(req, res))
                return;
            const { name, basePrice, description, isActive } = req.body;
            if (!name || !String(name).trim()) {
                return res
                    .status(400)
                    .json({ message: "Поле name (название услуги) обязательно" });
            }
            const [created] = await db_1.db
                .insert(services_1.services)
                .values({
                name: String(name).trim(),
                basePrice: basePrice !== undefined && basePrice !== null && basePrice !== ""
                    ? String(basePrice)
                    : null,
                description: description !== undefined &&
                    description !== null &&
                    description !== ""
                    ? String(description)
                    : null,
                isActive: Boolean(isActive),
            })
                .returning();
            return res.status(201).json({ service: created });
        }
        catch (err) {
            console.error("Admin services create error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // PUT /api/admin/services/:id
    async update(req, res) {
        try {
            if (!this.ensureAdmin(req, res))
                return;
            const { id } = req.params;
            const serviceId = Number(id);
            if (!Number.isFinite(serviceId)) {
                return res.status(400).json({ message: "Некорректный id услуги" });
            }
            const { name, basePrice, description, isActive } = req.body;
            if (!name || !String(name).trim()) {
                return res
                    .status(400)
                    .json({ message: "Поле name (название услуги) обязательно" });
            }
            const [updated] = await db_1.db
                .update(services_1.services)
                .set({
                name: String(name).trim(),
                basePrice: basePrice !== undefined && basePrice !== null && basePrice !== ""
                    ? String(basePrice)
                    : null,
                description: description !== undefined &&
                    description !== null &&
                    description !== ""
                    ? String(description)
                    : null,
                isActive: Boolean(isActive),
            })
                .where((0, drizzle_orm_1.eq)(services_1.services.id, serviceId))
                .returning();
            if (!updated) {
                return res.status(404).json({ message: "Услуга не найдена" });
            }
            return res.status(200).json({ service: updated });
        }
        catch (err) {
            console.error("Admin services update error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // DELETE /api/admin/services/:id
    async remove(req, res) {
        try {
            if (!this.ensureAdmin(req, res))
                return;
            const { id } = req.params;
            const serviceId = Number(id);
            if (!Number.isFinite(serviceId)) {
                return res.status(400).json({ message: "Некорректный id услуги" });
            }
            const [deleted] = await db_1.db
                .delete(services_1.services)
                .where((0, drizzle_orm_1.eq)(services_1.services.id, serviceId))
                .returning();
            if (!deleted) {
                return res.status(404).json({ message: "Услуга не найдена" });
            }
            return res.status(204).send();
        }
        catch (err) {
            console.error("Admin services delete error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.adminServiceController = new AdminServiceController();
