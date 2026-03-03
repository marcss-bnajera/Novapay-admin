`use strict`

import { Router } from "express";
import {
    getCurrencies,
    createCurrency,
    updateCurrency,
    deleteCurrency
} from "./currencies.controller.js";
import { validateCreateCurrency, validateUpdateCurrency, validateDeleteCurrency } from '../../middlewares/currencies-validator.js'

const router = Router();

router.get('/', getCurrencies);
router.post('/', createCurrency, validateCreateCurrency);
router.put('/:id', updateCurrency, validateUpdateCurrency);
router.delete('/:id', deleteCurrency, validateDeleteCurrency);

export default router;