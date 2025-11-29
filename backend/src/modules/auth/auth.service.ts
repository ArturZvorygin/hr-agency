// src/modules/auth/auth.service.ts
import { db } from "../../db/db";
import { users } from "../../db/schema/users";
import { companies } from "../../db/schema/companies";
import { refreshTokens } from "../../db/schema/tokens";
import { hashPassword, comparePassword } from "../../utils/password";
import { signToken } from "../../utils/jwt";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const REFRESH_TOKEN_TTL_DAYS = 30;
const REFRESH_TOKEN_TTL_MS = REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;

type RegisterDTO = {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    companyName: string;
};

type LoginDTO = {
    email: string;
    password: string;
};

export class AuthService {
    private async createRefreshToken(userId: string): Promise<string> {
        const token = randomUUID();
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

        await db.insert(refreshTokens).values({
            userId,
            token,
            expiresAt
        });

        return token;
    }

    async registerClient(dto: RegisterDTO) {
        // 1. Проверяем, что email свободен
        const existing = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.email, dto.email)
        });

        if (existing) {
            throw new Error("EMAIL_ALREADY_USED");
        }

        // 2. Создаём компанию
        const [company] = await db
            .insert(companies)
            .values({
                name: dto.companyName
            })
            .returning();

        // 3. Хэшируем пароль
        const passwordHash = await hashPassword(dto.password);

        // 4. Создаём пользователя-клиента
        const [user] = await db
            .insert(users)
            .values({
                email: dto.email,
                passwordHash,
                role: "client",
                firstName: dto.firstName,
                lastName: dto.lastName,
                phone: dto.phone,
                companyId: company.id
            })
            .returning();

        // 5. Генерируем access + refresh
        const accessToken = signToken({
            userId: user.id,
            role: user.role as "client" | "manager" | "admin"
        });

        const refreshToken = await this.createRefreshToken(user.id);

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                companyId: user.companyId
            },
            accessToken,
            refreshToken,
            // чтобы не ломать фронт, который ждёт token:
            token: accessToken
        };
    }

    async login(dto: LoginDTO) {
        const user = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.email, dto.email)
        });

        if (!user) {
            throw new Error("INVALID_CREDENTIALS");
        }

        const ok = await comparePassword(dto.password, user.passwordHash);
        if (!ok) {
            throw new Error("INVALID_CREDENTIALS");
        }

        const accessToken = signToken({
            userId: user.id,
            role: user.role as "client" | "manager" | "admin"
        });

        const refreshToken = await this.createRefreshToken(user.id);

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                companyId: user.companyId
            },
            accessToken,
            refreshToken,
            token: accessToken
        };
    }

    async getCurrentUser(userId: string) {
        const user = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.id, userId)
        });

        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            companyId: user.companyId
        };
    }

    async refresh(refreshToken: string) {
        const [stored] = await db
            .select()
            .from(refreshTokens)
            .where(eq(refreshTokens.token, refreshToken))
            .limit(1);

        if (!stored || stored.revokedAt) {
            throw new Error("INVALID_REFRESH_TOKEN");
        }

        if (stored.expiresAt && stored.expiresAt < new Date()) {
            throw new Error("INVALID_REFRESH_TOKEN");
        }

        const user = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.id, stored.userId)
        });

        if (!user || !user.isActive) {
            throw new Error("INVALID_REFRESH_TOKEN");
        }

        const accessToken = signToken({
            userId: user.id,
            role: user.role as "client" | "manager" | "admin"
        });

        // ротируем refresh: старый помечаем отозванным
        await db
            .update(refreshTokens)
            .set({ revokedAt: new Date() })
            .where(eq(refreshTokens.id, stored.id));

        const newRefreshToken = await this.createRefreshToken(user.id);

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                companyId: user.companyId
            },
            accessToken,
            refreshToken: newRefreshToken,
            token: accessToken
        };
    }

    async logout(refreshToken: string) {
        await db
            .update(refreshTokens)
            .set({ revokedAt: new Date() })
            .where(eq(refreshTokens.token, refreshToken));
    }
}

export const authService = new AuthService();
