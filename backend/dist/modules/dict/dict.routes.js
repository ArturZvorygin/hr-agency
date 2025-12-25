"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/dict/dict.routes.ts
const express_1 = require("express");
const dict_controller_1 = require("./dict.controller");
const router = (0, express_1.Router)();
// Публичный список категорий персонала
router.get("/staff-categories", (req, res) => dict_controller_1.dictController.getStaffCategories(req, res));
router.get("/services", (req, res) => dict_controller_1.dictController.getServices(req, res));
exports.default = router;
