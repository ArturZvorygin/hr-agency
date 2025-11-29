import { Router } from "express";
import { createPublicRequest } from "./public.controller";

export const publicRouter = Router();

// POST /api/public/requests
publicRouter.post("/requests", createPublicRequest);
