import Router from "express";
import {
    getShoppings,
    getShoppingById,
    updateShopping,
    deleteShopping,
    saveShopping
} from "./shoppings.controller.js";

const router = Router();

router.post("/", saveShopping);
router.get("/", getShoppings);
router.get("/:id", getShoppingById);
router.put("/:id", updateShopping);
router.delete("/:id", deleteShopping);

export default router;