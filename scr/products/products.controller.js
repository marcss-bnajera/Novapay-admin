'use strict';

import { Product } from "./products.model.js";

// Obtener todos los productos (GET) - El admin ve TODO
export const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json({
            success: true,
            total: products.length,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener productos",
            error: error.message
        });
    }
};

// Obtener producto por ID (GET)
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al buscar el producto",
            error: error.message
        });
    }
};

// Crear producto (POST) - Incluye validación de precio y categoría
export const createProduct = async (req, res) => {
    try {
        const { name, description, category, price, state } = req.body;

        if (price <= 0) {
            return res.status(400).json({
                success: false,
                message: "El precio debe ser un monto positivo"
            });
        }

        const product = await Product.create({
            name,
            description,
            category,
            price,
            state
        });

        res.status(201).json({
            success: true,
            message: "Producto creado exitosamente",
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear el producto",
            error: error.message
        });
    }
};

// Actualizar producto (PUT)
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, price, state } = req.body;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }

        // Actualización manual para asegurar que se procesen los cambios
        await product.update({ name, description, category, price, state });

        res.status(200).json({
            success: true,
            message: "Producto actualizado exitosamente",
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el producto",
            error: error.message
        });
    }
};

// "Eliminar" producto (DELETE) -> Rediseñado a Soft Delete
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }

        await product.update({ state: 'DISCONTINUED' });

        res.status(200).json({
            success: true,
            message: "El producto ha sido marcado como DISCONTINUED (Eliminación lógica)"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al procesar la baja del producto",
            error: error.message
        });
    }
};