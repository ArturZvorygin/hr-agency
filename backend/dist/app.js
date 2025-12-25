"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = require("./db/db");
const drizzle_orm_1 = require("drizzle-orm");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const company_routes_1 = __importDefault(require("./modules/companies/company.routes"));
const request_routes_1 = __importDefault(require("./modules/requests/request.routes"));
const dict_routes_1 = __importDefault(require("./modules/dict/dict.routes"));
const adminRequest_routes_1 = __importDefault(require("./modules/adminRequests/adminRequest.routes"));
const adminStats_routes_1 = __importDefault(require("./modules/adminStats/adminStats.routes"));
const adminService_routes_1 = __importDefault(require("./modules/adminServices/adminService.routes"));
const public_routes_1 = require("./modules/public/public.routes");
const requestComment_routes_1 = __importDefault(require("./modules/requestComments/requestComment.routes"));
const adminCategory_routes_1 = __importDefault(require("./modules/adminCategories/adminCategory.routes"));
const adminClient_routes_1 = __importDefault(require("./modules/adminClients/adminClient.routes"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        service: "hr-agency-backend",
        timestamp: new Date().toISOString()
    });
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/companies", company_routes_1.default);
app.use("/api/requests", request_routes_1.default);
app.use("/api/dict", dict_routes_1.default);
app.use("/api/admin/requests", adminRequest_routes_1.default);
app.use("/api/admin/services", adminService_routes_1.default);
app.use("/api/admin/stats", adminStats_routes_1.default);
app.use("/api/admin/comments", requestComment_routes_1.default);
app.use("/api/admin/categories", adminCategory_routes_1.default);
app.use("/api/admin/clients", adminClient_routes_1.default);
app.use("/api/public", public_routes_1.publicRouter);
// Проверка БД
app.get("/health/db", async (req, res) => {
    try {
        const result = await db_1.db.execute((0, drizzle_orm_1.sql) `select 1 as value`);
        res.json({
            status: "ok",
            db: true,
            result
        });
    }
    catch (err) {
        console.error("DB health error:", err);
        res.status(500).json({
            status: "error",
            db: false
        });
    }
});
