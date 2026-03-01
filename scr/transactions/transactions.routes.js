import { Router } from "express";
import {
    getTransactions,
    getTransactionById,
} from "./transactions.controller.js";

const router = Router();

router.get('/', getTransactions);
router.get('/:id', getTransactionById);

export default router;