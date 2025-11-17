import { db } from "../../db";
import { users } from "../../db/schema/users";
import { companies } from "../../db/schema/companies";
import { hashPassword, comparePassword } from "../../utils/password";
import { signToken } from "../../utils/jwt";

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

        // 5. Генерируем JWT
        const token = signToken({
            userId: user.id,
            role: user.role as "client" | "manager" | "admin"
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                companyId: user.companyId
            },
            token
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

        const token = signToken({
            userId: user.id,
            role: user.role as "client" | "manager" | "admin"
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                companyId: user.companyId
            },
            token
        };
    }
}

export const authService = new AuthService();
