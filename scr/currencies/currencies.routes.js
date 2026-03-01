import { Router } from "express";
import {
    getCurrencies,
    createCurrency,
    updateCurrency,
    deleteCurrency
} from "./currencies.controller.js";

const router = Router();

router.get('/', getCurrencies);
router.post('/', createCurrency);
router.put('/:id', updateCurrency);
router.delete('/:id', deleteCurrency);

export default router;