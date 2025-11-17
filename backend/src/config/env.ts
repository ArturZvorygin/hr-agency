// src/config/env.ts
import dotenv from "dotenv";

dotenv.config(); // грузим .env из корня backend

export const env = {
    PORT: Number(process.env.PORT) || 4000,
    DATABASE_URL: process.env.DATABASE_URL || "",
    JWT_SECRET: process.env.JWT_SECRET || "diploma_secret",
    JWT_EXPIRES: process.env.JWT_EXPIRES || "1h"
};
