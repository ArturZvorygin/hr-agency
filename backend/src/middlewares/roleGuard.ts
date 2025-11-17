// src/middlewares/roleGuard.ts
import { Request, Response, NextFunction } from "express";

type UserRole = "client" | "manager" | "admin";

export function roleGuard(allowed: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const current = (req as any).user;

        if (!current || !current.role) {
            return res.status(401).json({ message: "Требуется авторизация" });
        }

        if (!allowed.includes(current.role)) {
            return res.status(403).json({ message: "Недостаточно прав" });
        }

        next();
    };
}
