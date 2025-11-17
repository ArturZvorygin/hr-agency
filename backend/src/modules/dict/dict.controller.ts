// src/modules/dict/dict.controller.ts
import { Request, Response } from "express";
import { db } from "../../db";
import { staffCategories } from "../../db/schema/staffCategories";

class DictController {
    async getStaffCategories(req: Request, res: Response) {
        try {
            const items = await db.select().from(staffCategories);

            return res.status(200).json({ items });
        } catch (err) {
            console.error("getStaffCategories error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

export const dictController = new DictController();
