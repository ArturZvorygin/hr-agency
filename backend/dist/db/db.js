"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// src/db/db.ts
const pg_1 = require("pg");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const env_1 = require("../config/env");
// Импорт схем
const usersSchema = __importStar(require("../db/schema/users"));
const companiesSchema = __importStar(require("../db/schema/companies"));
const staffCategoriesSchema = __importStar(require("../db/schema/staffCategories"));
const servicesSchema = __importStar(require("../db/schema/services"));
const requestsSchema = __importStar(require("../db/schema/requests"));
const refreshTokensSchema = __importStar(require("../db/schema/tokens"));
if (!env_1.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in .env");
}
const pool = new pg_1.Pool({
    connectionString: env_1.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // ВАЖНО для Neon
});
exports.db = (0, node_postgres_1.drizzle)(pool, {
    schema: {
        ...usersSchema,
        ...companiesSchema,
        ...staffCategoriesSchema,
        ...servicesSchema,
        ...requestsSchema,
        ...refreshTokensSchema,
    }
});
