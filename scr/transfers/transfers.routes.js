`use strict`

import { Router } from "express";
import { getTransfers, getTransferById, createTransfer, updateTransfer, deleteTransfer } from "./transfers.controller.js";

const router = Router();

router.get("/", getTransfers);
router.get("/:id", getTransferById);
router.post("/", createTransfer);
router.put("/:id", updateTransfer);
router.delete("/:id", deleteTransfer);

export default router;