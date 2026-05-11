'use strict'

import { Router } from "express";
import { createCard, getCards, getCardsByAccount, deleteCard, updateCard } from "./cards.controller.js";

const router = Router();

router.get("/", getCards);
router.post("/create", createCard);
router.get("/account/:id", getCardsByAccount);
router.delete("/:id", deleteCard);
router.put("/:id", updateCard);

export default router;