'use strict'

import { Router } from "express";
import { createCard, getCardsByAccount } from "./cards.controller.js";

const router = Router();

router.post("/create", createCard);

router.get("/account/:id", getCardsByAccount);

export default router;