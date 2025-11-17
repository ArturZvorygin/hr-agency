// src/app.ts
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { db } from "./db";
import { sql } from "drizzle-orm";
import authRouter from "./modules/auth/auth.routes";
import companyRouter from "./modules/companies/company.routes";
import requestRouter from "./modules/requests/request.routes";
import dictRouter from "./modules/dict/dict.routes";
import adminRequestRouter from "./modules/adminRequests/adminRequest.routes";


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
app.use("/api/auth", authRouter);
app.use("/api/companies", companyRouter);
app.use("/api/requests", requestRouter);
app.use("/api/dict", dictRouter);
app.use("/api/admin/requests", adminRequestRouter);
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
