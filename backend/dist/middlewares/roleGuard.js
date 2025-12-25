"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleGuard = roleGuard;
function roleGuard(allowed) {
    return (req, res, next) => {
        const current = req.user;
        if (!current || !current.role) {
            return res.status(401).json({ message: "Требуется авторизация" });
        }
        if (!allowed.includes(current.role)) {
            return res.status(403).json({ message: "Недостаточно прав" });
        }
        next();
    };
}
