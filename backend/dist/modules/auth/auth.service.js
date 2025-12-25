"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
// src/modules/auth/auth.service.ts
const db_1 = require("../../db/db");
const users_1 = require("../../db/schema/users");
const companies_1 = require("../../db/schema/companies");
const tokens_1 = require("../../db/schema/tokens");
const password_1 = require("../../utils/password");
const jwt_1 = require("../../utils/jwt");
const drizzle_orm_1 = require("drizzle-orm");
const crypto_1 = require("crypto");
const REFRESH_TOKEN_TTL_DAYS = 30;
const REFRESH_TOKEN_TTL_MS = REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000;
class AuthService {
    async createRefreshToken(userId) {
        const token = (0, crypto_1.randomUUID)();
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
        await db_1.db.insert(tokens_1.refreshTokens).values({
            userId,
            token,
            expiresAt
        });
        return token;
    }
    async registerClient(dto) {
        // 1. Проверяем, что email свободен
        const existing = await db_1.db.query.users.findFirst({
            where: (u, { eq }) => eq(u.email, dto.email)
        });
        if (existing) {
            throw new Error("EMAIL_ALREADY_USED");
        }
        // 2. Создаём компанию
        const [company] = await db_1.db
            .insert(companies_1.companies)
            .values({
            name: dto.companyName
        })
            .returning();
        // 3. Хэшируем пароль
        const passwordHash = await (0, password_1.hashPassword)(dto.password);
        // 4. Создаём пользователя-клиента
        const [user] = await db_1.db
            .insert(users_1.users)
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
        const accessToken = (0, jwt_1.signToken)({
            userId: user.id,
            role: user.role
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
    async login(dto) {
        const user = await db_1.db.query.users.findFirst({
            where: (u, { eq }) => eq(u.email, dto.email)
        });
        if (!user) {
            throw new Error("INVALID_CREDENTIALS");
        }
        const ok = await (0, password_1.comparePassword)(dto.password, user.passwordHash);
        if (!ok) {
            throw new Error("INVALID_CREDENTIALS");
        }
        const accessToken = (0, jwt_1.signToken)({
            userId: user.id,
            role: user.role
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
    async getCurrentUser(userId) {
        const user = await db_1.db.query.users.findFirst({
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
    async refresh(refreshToken) {
        const [stored] = await db_1.db
            .select()
            .from(tokens_1.refreshTokens)
            .where((0, drizzle_orm_1.eq)(tokens_1.refreshTokens.token, refreshToken))
            .limit(1);
        if (!stored || stored.revokedAt) {
            throw new Error("INVALID_REFRESH_TOKEN");
        }
        if (stored.expiresAt && stored.expiresAt < new Date()) {
            throw new Error("INVALID_REFRESH_TOKEN");
        }
        const user = await db_1.db.query.users.findFirst({
            where: (u, { eq }) => eq(u.id, stored.userId)
        });
        if (!user || !user.isActive) {
            throw new Error("INVALID_REFRESH_TOKEN");
        }
        const accessToken = (0, jwt_1.signToken)({
            userId: user.id,
            role: user.role
        });
        // ротируем refresh: старый помечаем отозванным
        await db_1.db
            .update(tokens_1.refreshTokens)
            .set({ revokedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(tokens_1.refreshTokens.id, stored.id));
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
    async logout(refreshToken) {
        await db_1.db
            .update(tokens_1.refreshTokens)
            .set({ revokedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(tokens_1.refreshTokens.token, refreshToken));
    }
    // src/modules/auth/auth.service.ts
    async changePassword(userId, currentPassword, newPassword) {
        const user = await db_1.db.query.users.findFirst({
            where: (u, { eq }) => eq(u.id, userId)
        });
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }
        const ok = await (0, password_1.comparePassword)(currentPassword, user.passwordHash);
        if (!ok) {
            throw new Error("INVALID_CURRENT_PASSWORD");
        }
        const newHash = await (0, password_1.hashPassword)(newPassword);
        await db_1.db
            .update(users_1.users)
            .set({ passwordHash: newHash })
            .where((0, drizzle_orm_1.eq)(users_1.users.id, user.id));
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
