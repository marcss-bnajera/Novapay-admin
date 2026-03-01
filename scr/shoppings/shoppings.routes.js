import Router from "express";
import {
    getShoppings,
    getShoppingById,
    updateShopping,
    deleteShopping
} from "./shoppings.controller.js";

const router = Router();

router.get("/", getShoppings);
router.get("/:id", getShoppingById);
router.put("/:id", updateShopping);
router.delete("/:id", deleteShopping);

export default router;