`use strict`

import { Router } from "express";
import { getDashboardStats } from "./dashboard.controller.js";

const router = Router();

// GET /api/dashboard/stats
router.get("/home", getDashboardStats);

export default router;