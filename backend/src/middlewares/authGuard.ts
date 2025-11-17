// src/middlewares/authGuard.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export function authGuard(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Требуется авторизация" });
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
        return res.status(401).json({ message: "Некорректный формат токена" });
    }

    try {
        const payload = verifyToken(token);
        // Для простоты складываем в req как any
        (req as any).user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Неверный или просроченный токен" });
    }
}
