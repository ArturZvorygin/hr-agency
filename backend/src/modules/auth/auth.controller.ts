import { Request, Response } from "express";
import { authService } from "./auth.service";

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { email, password, firstName, lastName, phone, companyName } = req.body;

            if (!email || !password || !companyName) {
                return res.status(400).json({ message: "email, password и companyName обязательны" });
            }

            const result = await authService.registerClient({
                email,
                password,
                firstName,
                lastName,
                phone,
                companyName
            });

            return res.status(201).json(result);
        } catch (err: any) {
            if (err.message === "EMAIL_ALREADY_USED") {
                return res.status(409).json({ message: "Email уже используется" });
            }
            console.error("Register error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "email и password обязательны" });
            }

            const result = await authService.login({ email, password });

            return res.status(200).json(result);
        } catch (err: any) {
            if (err.message === "INVALID_CREDENTIALS") {
                return res.status(401).json({ message: "Неверный email или пароль" });
            }
            console.error("Login error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async me(req: Request, res: Response) {
        try {
            const current = (req as any).user;

            if (!current || !current.userId) {
                return res.status(401).json({ message: "Требуется авторизация" });
            }

            const user = await authService.getCurrentUser(current.userId);

            return res.status(200).json({ user });
        } catch (err: any) {
            if (err.message === "USER_NOT_FOUND") {
                return res.status(404).json({ message: "Пользователь не найден" });
            }
            console.error("Me error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

}

export const authController = new AuthController();
