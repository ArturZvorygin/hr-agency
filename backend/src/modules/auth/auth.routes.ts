import { Router } from "express";
import { authController } from "./auth.controller";
import {authGuard} from "../../middlewares/authGuard";

const router = Router();

router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.get("/me", authGuard, (req, res) => authController.me(req, res));

export default router;
