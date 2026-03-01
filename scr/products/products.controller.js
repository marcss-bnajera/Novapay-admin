'use strict';

import { Product } from "./products.model.js";

// Funciones de administrador

// Obtener todos los productos (GET)
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
        })
    }
}

// Crear producto (POST)
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, state } = req.body;

        const product = await Product.create({ name, description, price, state });

        res.status(201).json({
            success: true,
            message: "Producto creado"
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
        const { name, description, price, state } = req.body;

        //Actualizamos
        const { updateRows } = await Product.update(
            { name, description, price, state },
            { where: { id } }
        );

        if (updateRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado o no hubo cambios"
            });
        }

        res.status(200).json({
            success: true,
            message: "Producto actualizado exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el producto",
            error: error.message
        });
    }
};

// Eliminar producto (DELETE)
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteRows = await Product.destroy({
            where: { id }
        });

        if (deleteRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            message: "Producto eliminado permanentemente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el producto",
            error: error.message
        });
    }
}
