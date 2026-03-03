`use strict`

import { Router } from "express";
import {
    getAccounts,
    getAccountByNumber,
    getAccountsByActivity,
    updateAccount,
    deleteAccount
} from "./accounts.controller.js";
import { validateGetAccountByNumber, validateUpdateAccountAdmin, validateGetAccountsActivity, validateDeleteAccount } from '../../middlewares/accounts-validator.js'

const router = Router();

// Obtener todas las cuentas
router.get("/", getAccounts);

//obtener la cuentas cuentas con mayor actividad
router.get("/activity", getAccountsByActivity, validateGetAccountsActivity);

// Obtener una cuenta específica por su número
router.get("/:numero_cuenta", getAccountByNumber, validateGetAccountByNumber);

// Actualizar 
router.put("/:numero_cuenta", updateAccount, validateUpdateAccountAdmin);

router.delete("/:numero_cuenta", deleteAccount, validateDeleteAccount);

export default router;