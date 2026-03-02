`use strict`

import { Router } from "express";
import {
    getAllTransfers,
    getTransfersByAccount
} from "./transfers.controller.js";

const router = Router();

// Endpoint para ver TODO el historial del banco
router.get("/all", getAllTransfers);

// Endpoint para buscar movimientos de una cuenta específica
router.get("/accounts/:id_cuenta", getTransfersByAccount);

export default router;
