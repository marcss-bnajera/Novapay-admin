'use strict'

import { Router } from "express";
import {
    createPassbook,
    getPassbooks,
    getPassbookByAccount,
    deletePassbook,
    updatePassbook
} from "./passbooks.controller.js";

const router = Router();

router.get("/", getPassbooks);
router.post("/create", createPassbook);
router.get("/account/:id", getPassbookByAccount);
router.put("/:id", updatePassbook);
router.delete("/:id", deletePassbook);

export default router;