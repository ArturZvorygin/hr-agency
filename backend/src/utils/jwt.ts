// src/utils/jwt.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = (process.env.JWT_SECRET || "diploma_secret") as string;
const JWT_EXPIRES = (process.env.JWT_EXPIRES || "1h") as string;

export type JwtPayload = {
    userId: string;
    role: "client" | "manager" | "admin";
};

export function signToken(payload: JwtPayload): string {
    // Для диплома не мучаемся с типами jsonwebtoken —
    // просто подсказываем TS, что всё ok.
    return jwt.sign(payload as any, JWT_SECRET as any, {
        expiresIn: JWT_EXPIRES as any
    });
}

export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET as any) as JwtPayload;
}
