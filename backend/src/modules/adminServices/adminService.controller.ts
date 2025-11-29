// src/modules/adminServices/adminService.controller.ts
import { Request, Response } from "express";
import { db } from "../../db/db";
import { services } from "../../db/schema/services";
import { eq } from "drizzle-orm";

class AdminServiceController {
    private ensureAdmin(req: Request, res: Response) {
        const current = (req as any).user;

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
    async list(req: Request, res: Response) {
        try {
            if (!this.ensureAdmin(req, res)) return;

            const rows = await db
                .select()
                .from(services)
                .orderBy(services.name);

            return res.status(200).json({ services: rows });
        } catch (err) {
            console.error("Admin services list error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // POST /api/admin/services
    async create(req: Request, res: Response) {
        try {
            if (!this.ensureAdmin(req, res)) return;

            const { name, basePrice, description, isActive } = req.body;

            if (!name || !String(name).trim()) {
                return res
                    .status(400)
                    .json({ message: "Поле name (название услуги) обязательно" });
            }

            const [created] = await db
                .insert(services)
                .values({
                    name: String(name).trim(),
                    basePrice:
                        basePrice !== undefined && basePrice !== null && basePrice !== ""
                            ? String(basePrice)
                            : null,
                    description:
                        description !== undefined &&
                        description !== null &&
                        description !== ""
                            ? String(description)
                            : null,
                    isActive: Boolean(isActive),
                } as any)
                .returning();

            return res.status(201).json({ service: created });
        } catch (err) {
            console.error("Admin services create error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // PUT /api/admin/services/:id
    async update(req: Request, res: Response) {
        try {
            if (!this.ensureAdmin(req, res)) return;

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

            const [updated] = await db
                .update(services)
                .set({
                    name: String(name).trim(),
                    basePrice:
                        basePrice !== undefined && basePrice !== null && basePrice !== ""
                            ? String(basePrice)
                            : null,
                    description:
                        description !== undefined &&
                        description !== null &&
                        description !== ""
                            ? String(description)
                            : null,
                    isActive: Boolean(isActive),
                } as any)
                .where(eq(services.id, serviceId))
                .returning();

            if (!updated) {
                return res.status(404).json({ message: "Услуга не найдена" });
            }

            return res.status(200).json({ service: updated });
        } catch (err) {
            console.error("Admin services update error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // DELETE /api/admin/services/:id
    async remove(req: Request, res: Response) {
        try {
            if (!this.ensureAdmin(req, res)) return;

            const { id } = req.params;
            const serviceId = Number(id);

            if (!Number.isFinite(serviceId)) {
                return res.status(400).json({ message: "Некорректный id услуги" });
            }

            const [deleted] = await db
                .delete(services)
                .where(eq(services.id, serviceId))
                .returning();

            if (!deleted) {
                return res.status(404).json({ message: "Услуга не найдена" });
            }

            return res.status(204).send();
        } catch (err) {
            console.error("Admin services delete error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const adminServiceController = new AdminServiceController();
