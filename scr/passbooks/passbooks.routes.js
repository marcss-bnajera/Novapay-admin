'use strict'

import { Router } from "express";
import { createPassbook, getPassbookByAccount } from "./passbooks.controller.js";

const router = Router();

router.post("/create", createPassbook);

router.get("/account/:id", getPassbookByAccount);

export default router;