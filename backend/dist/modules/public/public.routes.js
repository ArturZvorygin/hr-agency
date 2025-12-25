"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRouter = void 0;
const express_1 = require("express");
const public_controller_1 = require("./public.controller");
exports.publicRouter = (0, express_1.Router)();
// POST /api/public/requests
exports.publicRouter.post("/requests", public_controller_1.createPublicRequest);
