import { Router } from "express";
import {
    getTransactions,
    getTransactionById,
} from "./transactions.controller.js";
import { validateGetTransactionById } from '../../middlewares/transactoins-validator.js'

const router = Router();

router.get('/', getTransactions);
router.get('/:id', getTransactionById, validateGetTransactionById);

export default router;