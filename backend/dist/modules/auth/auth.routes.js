"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const authGuard_1 = require("../../middlewares/authGuard");
const router = (0, express_1.Router)();
router.post("/register", (req, res) => auth_controller_1.authController.register(req, res));
router.post("/login", (req, res) => auth_controller_1.authController.login(req, res));
router.get("/me", authGuard_1.authGuard, (req, res) => auth_controller_1.authController.me(req, res));
// refresh + logout по refreshToken из тела
router.post("/refresh", (req, res) => auth_controller_1.authController.refresh(req, res));
router.post("/logout", (req, res) => auth_controller_1.authController.logout(req, res));
router.post("/change-password", authGuard_1.authGuard, (req, res) => auth_controller_1.authController.changePassword(req, res));
exports.default = router;
