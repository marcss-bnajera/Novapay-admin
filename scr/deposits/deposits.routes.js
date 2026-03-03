import { Router } from "express";
import {
    makeDeposit
} from "./deposits.controller.js";
import { validateMakeDeposit } from '../../middlewares/depostis-validator.js'
const router = Router();


router.post("/deposit", makeDeposit, validateMakeDeposit);

export default router;