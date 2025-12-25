"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const app_1 = require("./app");
const env_1 = require("./config/env");
const start = async () => {
    try {
        app_1.app.listen(env_1.env.PORT, () => {
            console.log(`🚀 Server running on http://localhost:${env_1.env.PORT}`);
        });
    }
    catch (err) {
        console.error("Failed to start server", err);
        process.exit(1);
    }
};
start();
