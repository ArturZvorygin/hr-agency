"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
// src/config/env.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // грузим .env из корня backend
exports.env = {
    PORT: Number(process.env.PORT) || 4000,
    DATABASE_URL: process.env.DATABASE_URL || "",
    JWT_SECRET: process.env.JWT_SECRET || "diploma_secret",
    JWT_EXPIRES: process.env.JWT_EXPIRES || "1h"
};
