'use strict'

import { Router } from "express";
import { createCard, getCards, getCardsByAccount, deleteCard } from "./cards.controller.js";

const router = Router();

router.get("/", getCards);
router.post("/create", createCard);
router.get("/account/:id", getCardsByAccount);
router.delete("/:id", deleteCard);

export default router;