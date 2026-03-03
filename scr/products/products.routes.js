'use strict';

import { Router } from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "./products.controller.js";
import { validateCreateProduct, validateUpdateProduct, validateProductId } from '../../middlewares/products-validator.js'

const router = Router();

// Rutas para la gestión de productos
router.get("/", getProducts);
router.get("/:id", getProductById, validateProductId);
router.post("/", createProduct, validateCreateProduct);
router.put("/:id", updateProduct, validateUpdateProduct);
router.delete("/:id", deleteProduct);

export default router;