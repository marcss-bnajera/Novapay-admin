import Router from "express";
import {
    getShoppings,
    getShoppingById,
    updateShopping,
    deleteShopping,
    saveShopping,
    getLatestMovements
} from "./shoppings.controller.js";

const router = Router();

router.post("/", saveShopping);
router.get("/", getShoppings);
router.get("/latest/:cuenta_id", getLatestMovements);
router.get("/:id", getShoppingById);
router.put("/:id", updateShopping);
router.delete("/:id", deleteShopping);

export default router;