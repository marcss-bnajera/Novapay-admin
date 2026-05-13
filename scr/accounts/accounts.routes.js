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
router.get("/activity", validateGetAccountsActivity, getAccountsByActivity);

// Obtener una cuenta específica por su número
router.get("/:numero_cuenta", validateGetAccountByNumber, getAccountByNumber);

// Actualizar 
router.put("/:numero_cuenta", validateUpdateAccountAdmin, updateAccount);

router.delete("/:numero_cuenta", validateDeleteAccount, deleteAccount);

export default router;