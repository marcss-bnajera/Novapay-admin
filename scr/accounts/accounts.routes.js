`use strict`

import { Router } from "express";
import {
    getAccounts,
    getAccountByNumber,
    updateAccount,
    deleteAccount
} from "./accounts.controller.js";

const router = Router();

// Obtener todas las cuentas
router.get("/", getAccounts);

// Obtener una cuenta específica por su número
router.get("/:numero_cuenta", getAccountByNumber);

// Actualizar 
router.put("/:numero_cuenta", updateAccount);

router.delete("/:numero_cuenta", deleteAccount);

export default router;