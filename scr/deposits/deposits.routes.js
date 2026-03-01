import { Router } from "express";
import {
    makeDeposit
} from "./deposits.controller.js";

const router = Router();


router.post("/deposit", makeDeposit);

export default router;