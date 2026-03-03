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

router.post("/", saveShopping, validateSaveShopping);
router.get("/", getShoppings);
router.get("/latest/:cuenta_id", getLatestMovements, validateGetLatestMovements);
router.get("/:id", getShoppingById);
router.put("/:id", updateShopping, validateUpdateShopping);
router.delete("/:id", deleteShopping, validateDeleteShopping);

export default router;