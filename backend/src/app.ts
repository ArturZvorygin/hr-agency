// src/app.ts
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { db } from "./db";
import { sql } from "drizzle-orm";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        service: "hr-agency-backend",
        timestamp: new Date().toISOString()
    });
});

// Проверка БД
app.get("/health/db", async (req, res) => {
    try {
        const result = await db.execute(sql`select 1 as value`);
        res.json({
            status: "ok",
            db: true,
            result
        });
    } catch (err) {
        console.error("DB health error:", err);
        res.status(500).json({
            status: "error",
            db: false
        });
    }
});

export { app };
