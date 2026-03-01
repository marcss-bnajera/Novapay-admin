import { Router } from "express";
import {
    getAccounts,
    getAccountById,
    updateAccount,
    deleteAccount
} from "./accounts.controller.js";

const router = Router();

router.get('/', getAccounts);
router.get('/:id', getAccountById);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);

export default router;