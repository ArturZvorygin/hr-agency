// src/config/env.ts
import dotenv from "dotenv";

dotenv.config();

const REQUIRED_VARS = ["PORT"];

for (const v of REQUIRED_VARS) {
    if (!process.env[v]) {
        console.warn(`[env] Variable ${v} is not set. Using default if provided.`);
    }
}

export const env = {
    PORT: process.env.PORT ? Number(process.env.PORT) : 4000
};
