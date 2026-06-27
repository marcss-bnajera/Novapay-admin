import Router from "express";
import {
    getShoppings,
    getShoppingById,
    updateShopping,
    deleteShopping,
    saveShopping,
    getLatestMovements
} from "./shoppings.controller.js";
import { validateSaveShopping, validateUpdateShopping, validateGetLatestMovements, validateDeleteShopping } from '../../middlewares/shopping-validator.js'

const router = Router();

router.post("/", validateSaveShopping, saveShopping);
router.get("/", getShoppings);
router.get("/latest/:cuenta_id", validateGetLatestMovements, getLatestMovements);
router.get("/:id", getShoppingById);
router.put("/:id", validateUpdateShopping, updateShopping);
router.delete("/:id", validateDeleteShopping, deleteShopping);

export default router;