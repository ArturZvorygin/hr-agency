"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
class AuthController {
    async register(req, res) {
        try {
            const { email, password, firstName, lastName, phone, companyName } = req.body;
            if (!email || !password || !companyName) {
                return res.status(400).json({ message: "email, password и companyName обязательны" });
            }
            const result = await auth_service_1.authService.registerClient({
                email,
                password,
                firstName,
                lastName,
                phone,
                companyName
            });
            return res.status(201).json(result);
        }
        catch (err) {
            if (err.message === "EMAIL_ALREADY_USED") {
                return res.status(409).json({ message: "Email уже используется" });
            }
            console.error("Register error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "email и password обязательны" });
            }
            const result = await auth_service_1.authService.login({ email, password });
            return res.status(200).json(result);
        }
        catch (err) {
            if (err.message === "INVALID_CREDENTIALS") {
                return res.status(401).json({ message: "Неверный email или пароль" });
            }
            console.error("Login error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async me(req, res) {
        try {
            const current = req.user;
            if (!current || !current.userId) {
                return res.status(401).json({ message: "Требуется авторизация" });
            }
            const user = await auth_service_1.authService.getCurrentUser(current.userId);
            return res.status(200).json({ user });
        }
        catch (err) {
            if (err.message === "USER_NOT_FOUND") {
                return res.status(404).json({ message: "Пользователь не найден" });
            }
            console.error("Me error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async refresh(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ message: "refreshToken обязателен" });
            }
            const result = await auth_service_1.authService.refresh(refreshToken);
            return res.status(200).json(result);
        }
        catch (err) {
            if (err.message === "INVALID_REFRESH_TOKEN") {
                return res.status(401).json({ message: "Неверный или истёкший refreshToken" });
            }
            console.error("Refresh error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async logout(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ message: "refreshToken обязателен" });
            }
            await auth_service_1.authService.logout(refreshToken);
            return res.status(200).json({ message: "Выход выполнен" });
        }
        catch (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // src/modules/auth/auth.controller.ts
    async changePassword(req, res) {
        try {
            const current = req.user;
            if (!current || !current.userId) {
                return res.status(401).json({ message: "Требуется авторизация" });
            }
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                return res
                    .status(400)
                    .json({ message: "currentPassword и newPassword обязательны" });
            }
            if (String(newPassword).length < 6) {
                return res
                    .status(400)
                    .json({ message: "Новый пароль должен быть не короче 6 символов" });
            }
            await auth_service_1.authService.changePassword(current.userId, currentPassword, newPassword);
            return res.status(200).json({ message: "Пароль успешно изменён" });
        }
        catch (err) {
            if (err.message === "USER_NOT_FOUND") {
                return res.status(404).json({ message: "Пользователь не найден" });
            }
            if (err.message === "INVALID_CURRENT_PASSWORD") {
                return res.status(400).json({ message: "Текущий пароль неверный" });
            }
            console.error("Change password error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
