import { Router } from "express";
import { makeDeposit, getDeposits } from "./deposits.controller.js";
import { validateMakeDeposit } from '../../middlewares/depostis-validator.js'
const router = Router();

router.get("/", getDeposits);
router.post("/deposit", validateMakeDeposit, makeDeposit);

export default router;