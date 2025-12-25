"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = authGuard;
const jwt_1 = require("../utils/jwt");
function authGuard(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Требуется авторизация" });
    }
    const [type, token] = authHeader.split(" ");
    if (type !== "Bearer" || !token) {
        return res.status(401).json({ message: "Некорректный формат токена" });
    }
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        // Для простоты складываем в req как any
        req.user = payload;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Неверный или просроченный токен" });
    }
}
